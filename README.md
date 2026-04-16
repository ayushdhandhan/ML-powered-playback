# MUSIC-Reco: Adaptive Listening Engine

MUSIC-Reco is a modern, adaptive music recommendation web application that dynamically matches users' emotional states and unstructured text inputs to optimal acoustic profiles using rule-based feature mapping. It is built as a single-page application utilizing React, Tailwind CSS, Framer Motion, and a Supabase backend.

## 🎯 Overview & Objectives

The primary objective of MUSIC-Reco is to bridge the gap between user emotion and content curation. Instead of manually searching for genres, users input their current feelings, and the engine correlates text keywords to distinct "Mood-Energy" profiles (e.g., High Energy + High Valence = Happy/Energetic). The system then provides curated YouTube-backed playlists, tracks real-time listening habits, and generates dynamic behavioral analytics for the user.

## ✨ Core Features

1. **Rule-Based Recommendation Engine:**
   - **Free-Text Mood Parsing:** A sophisticated keyword extraction maps unstructured user input (e.g., "I'm pumped for the gym") to predefined acoustic profiles (Energetic, Focus, Chill, Party, Sad, Happy).
   - **Feature Mapping:** Every recommendation is backed by acoustic features (Valence, Energy, Danceability, Tempo) ensuring the song matches the physiological state of the user.
   - **AI-Friendly Explainability:** The engine generates dynamic, transparent explanations for *why* a particular playlist was selected using behavioral analysis terminology.

2. **Adaptive Music Player:**
   - Seamlessly integrates the YouTube Iframe API for continuous playback.
   - Dynamically scales its layout from a full 16:9 media view to a highly responsive, custom-built Audio Player UI lacking visual distraction.
   - Calculates progress, manages volume states, and handles loop/skip interactions locally.

3. **User Authentication & Data Persistence (Supabase):**
   - Secure Login/Signup flowing through Supabase Auth.
   - Persistent `Favorites` library tied explicitly to UUIDs using rigorous Row Level Security (RLS) policies.
   - Real-time logging of `user_interactions` to safely build a historical listening corpus for analysis.

4. **Analytics & Behavioral Dashboard:**
   - Visualizes user listening habits over time using `Recharts`.
   - Projects "Valence vs. Energy" scatters, and builds bar/line charts mapping out the frequency of mood shifts throughout the user's historical interactions.
   - Synthesizes user data to display their most frequent current acoustic state.

5. **Premium UI/UX System:**
   - Employs a custom "Analogous + Complementary" color palette (Teal, Blue-grey, Green with Burnt Orange calls-to-action on a Beige neutral base).
   - Rich micro-animations orchestrated by Framer Motion (page transitions, hover states, parallax scaling).
   - Deeply responsive interfaces: specifically utilizing an adaptive bottom-navigation bar on mobile viewports for enhanced ergonomic reach.

## 🏗 System Architecture & Technology Stack

### Frontend Client
- **Framework:** React 18 powered by Vite.
- **Routing:** React Router DOM (Dynamic nested routes and query parameters).
- **Styling:** Tailwind CSS (Utility-first, heavily utilizing custom gradients and backdrop-blurs).
- **Animation:** Framer Motion (Declarative animations for UI mounting and interactions).
- **Charting:** Recharts (Responsive SVG charting).
- **Icons:** Lucide React.

### Backend Services (Supabase)
- **Database:** PostgreSQL.
- **Authentication:** Supabase Auth (Email/Password).
- **Storage & Security:** Fully secured via Postgres Row Level Security (RLS) preventing users from reading or writing data belonging to other UUIDs.

## 🗄️ Database Schema & Entities

The application relies on three fundamental data domains within Supabase:

1. **`auth.users`:** (Managed automatically by Supabase) Stores authenticated identities.
2. **`public.favorites`:**
   - Tracks songs users have manually favorited.
   - Fields: `id` (UUID), `created_at` (Timestamp), `user_id` (Auth UUID), `video_id` (Text), `video_title` (Text), `playlist_id` (Text), `playlist_data` (JSONB), `thumbnail_url` (Text).
3. **`public.user_interactions`:**
   - Automatically logs interaction metrics whenever a user triggers a mood recommendation.
   - Fields: `id` (UUID), `created_at` (Timestamp), `user_id` (Auth UUID), `action_type` (Text - e.g., 'mood_selected'), `mood` (Text), `metadata` (JSONB - supporting tracking coordinates or expanded tags).

## 🚀 Deployment Pipeline
- The codebase is hosted on GitHub and hooked to **Vercel** via CI/CD. 
- Builds are minified using Vite's Rollup configuration with dynamic asset chunking. Ensure environmental variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are injected during Vercel's build step.
