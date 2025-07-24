# Political Survey - Next.js Fullstack Application

A modern, responsive political survey application built with Next.js, TypeScript, and Tailwind CSS. Features a beautiful glass-morphism design with a purple gradient background and seamless user experience across all devices.

## ✨ Features

- **📱 Fully Responsive**: Perfect mobile and desktop experience
- **🎨 Modern UI**: Glass-morphism design with purple gradient background
- **📊 Multi-Step Survey**: User info collection → survey questions → completion
- **🔄 Progress Tracking**: Visual progress bar during survey
- **📝 Results Page**: Email-based results lookup at `/results`
- **⚡ Next.js Performance**: Server-side rendering, optimized builds, and fast loading
- **🔒 Type Safety**: Full TypeScript implementation
- **💾 Database Integration**: Supabase for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (recommended)
- A Supabase account and project

### Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Update `.env.local` with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GIPHY_API_KEY=your_giphy_api_key_optional
   ```

3. **Set up your database** (see Database Setup section below)

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
survey/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page (main survey)
│   │   ├── results/page.tsx   # Results lookup page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles with gradient
│   ├── components/            # React components
│   │   ├── SurveyApp.tsx     # Main survey application
│   │   ├── UserInfoForm.tsx  # User information form
│   │   ├── SurveyQuestion.tsx # Survey question component
│   │   ├── CompletionScreen.tsx # Survey completion screen
│   │   └── ResultsPage.tsx   # Results lookup form
│   └── lib/
│       └── supabase.ts       # Supabase client configuration
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build optimized production bundle
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint for code quality

## 🔧 Database Setup

Your Supabase database needs these tables:

### `surveys` table:
```sql
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `questions` table:
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  label_0 TEXT NOT NULL,
  label_5 TEXT,
  label_10 TEXT NOT NULL
);
```

### `answers` table:
```sql
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  survey_id INTEGER REFERENCES surveys(id),
  question_id INTEGER REFERENCES questions(id),
  opinion_score INTEGER,
  importance_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Application Flow

1. **Home Page (`/`)**: 
   - User enters personal information (name, email)
   - Starts the political survey
   - Answers questions with opinion (1-9) and importance (1-5) scores
   - Views completion screen with political meme

2. **Results Page (`/results`)**:
   - Enter email to retrieve survey analysis
   - Future: Display personalized political analysis

## 🎨 Design Features

- **Purple Gradient Background**: Beautiful gradient from purple to pink
- **Glass-morphism Cards**: Semi-transparent cards with backdrop blur
- **Mobile-First Design**: Optimized for all screen sizes
- **Interactive Elements**: Smooth transitions and hover effects
- **Progress Indicators**: Visual feedback throughout the survey
- **Custom Sliders**: Mobile-friendly range inputs with custom styling

## 🚀 Deployment

### Recommended: Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy automatically on git push

### Alternative: Any Node.js hosting
1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Ensure environment variables are properly set

## 🔧 Customization

- **Colors**: Modify the gradient in `src/app/globals.css`
- **Components**: Edit React components in `src/components/`
- **Routing**: Add new pages in `src/app/`
- **Styling**: All styling uses Tailwind CSS classes
- **Database**: Extend tables in Supabase as needed

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🔄 Recent Migration

This application was successfully migrated from Vite + React to Next.js, preserving all functionality while adding:
- Server-side rendering for better SEO
- Optimized builds and performance
- Modern Next.js App Router
- Production-ready deployment options

---

## 🎉 You're Ready!

Your Next.js political survey application is now running in the root directory with full functionality. The beautiful gradient background, responsive design, and smooth user experience are all preserved while gaining the benefits of Next.js for fullstack development.

Start the development server with `npm run dev` and visit [http://localhost:3000](http://localhost:3000) to see your survey in action!