# The Cues Coach

**The Cues Coach** is a mobile-first web application designed to help users master social skills through gamified, daily micro-challenges. Based on the "Science of People" framework, it balances **Warmth** and **Competence** to help users achieve the "Charmer" archetype.

## 🎯 Product Overview

Social skills can be learned. The Cues Coach breaks down complex social interactions into small, actionable "Cues" that users practice in the real world.

### Core Features
*   **Charisma Audit (Onboarding)**: A psychological assessment that segments users into one of three archetypes:
    *   **Pushover**: High Warmth, Low Competence.
    *   **Cold Fish**: Low Warmth, High Competence.
    *   **Charmer**: Balanced Warmth and Competence.
*   **Daily Cues**: A personalized daily challenge selected to target the user's specific weaknesses (e.g., a "Cold Fish" receives Warmth cues).
*   **Reflection Loop**: After completing a cue, users log a quick reflection to reinforce learning.
*   **Gamification**:
    *   **Charisma Meter**: Visualizes the balance between Warmth and Competence.
    *   **Streaks**: Tracks daily consistency.
    *   **Library**: A history of mastered cues.

## 🛠️ Technical Implementation

This project is built with a modern, type-safe stack focusing on performance and developer experience.

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **ORM**: [Prisma](https://www.prisma.io/) (v5)
*   **Styling**:
    *   [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first configuration)
    *   [Shadcn/UI](https://ui.shadcn.com/) (Accessible components)
    *   **Design System**: Custom OKLCH color palette & Nunito typography.
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **State Management**: Server Actions & React Server Components.
*   **Authentication**: Lightweight cookie-based session (Prototype).

## 🚀 Developer Guide

### Prerequisites
*   Node.js 18+
*   npm

### Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/israelvicars/cues-coach.git
    cd cues-coach
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory. You will need Supabase credentials.
    ```bash
    # Connect to Supabase via connection pooling (Transaction Mode)
    DATABASE_URL="postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

    # Direct connection to the database (Session Mode)
    DIRECT_URL="postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:5432/postgres"
    ```
    *See `SUPABASE_PRISMA_CONFIG.md` for detailed configuration instructions.*

4.  **Database Setup**:
    Sync the schema and seed the database with initial cues.
    ```bash
    npx prisma db push
    npx prisma db seed
    ```

5.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

*   `app/`: Next.js App Router pages and layouts.
    *   `actions/`: Server Actions for data mutation (`user.ts`, `cues.ts`).
    *   `dashboard/`: Core application views (Daily Cue, Library, Profile).
    *   `onboarding/`: Initial user assessment flow.
*   `components/`: React components.
    *   `ui/`: Shadcn/UI primitives.
    *   `daily-cue-card.tsx`: The main interactive component.
    *   `charisma-meter.tsx`: Visual progress tracker.
*   `lib/`: Utilities and configuration.
    *   `prisma.ts`: Database client singleton.
    *   `validations/`: Zod schemas.
*   `prisma/`: Database schema and seed scripts.
