-- Create a table for user profiles to store moodHistory, settings
create table public.profiles (
  id uuid references auth.users not null primary key,
  settings jsonb default '{"theme": "dark", "autoplay": true, "recommendations": true}'::jsonb,
  mood_history jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);


-- Create a table for favorite playlists
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  playlist_id text not null,
  playlist_data jsonb not null, -- Stores the JSON representation of the playlist
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for favorites
alter table public.favorites enable row level security;

create policy "Users can view their own favorites." on favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites." on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites." on favorites
  for delete using (auth.uid() = user_id);


-- Function to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
