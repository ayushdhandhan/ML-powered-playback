# Adaptive Music Player

A feature-rich, professional music recommendation system built with React, Vite, and Supabase.

## Features

- **Adaptive Mood Tracking**: Analyzes user mood selections and recommends music tailored to current emotional states.
- **Real-Time Interaction Tracking**: Captures user interactions using a Supabase backend to improve personalized recommendations.
- **Favorites Library**: Persistent storage for favorite songs and playlists.
- **Rule-Based Recommendation Engine**: Algorithmically curates music choices based on historical listening preferences.
- **Responsive UI**: A polished, motion-rich interface built with Tailwind CSS and Framer Motion.
- **Authentication**: Seamless user login and profile management via Supabase Auth.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **Deployment**: Vercel ready

## Setup

1. Copy `.env.local.example` to `.env.local` and add your Supabase credentials.
2. Run database migrations using the provided `supabase_schema.sql`.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Building for Production

Run `npm run build` to create an optimized production build.
