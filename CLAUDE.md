# CLAUDE.md - Harry&LacLac

## Project Overview
**Harry&LacLac** - Ứng dụng học tiếng Anh cho trẻ em Việt Nam (3-12 tuổi).
Lấy cảm hứng từ RinoDigi, tích hợp AI tutor, nhận diện giọng nói, và giáo trình chuẩn Cambridge YLE.

## Tech Stack
- **Framework**: Vite 8 + React 19 + TypeScript
- **Styling**: Vanilla CSS with CSS Variables (design tokens in `src/index.css`)
- **State**: Zustand (stores in `src/stores/`)
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **Charts**: Recharts (parent dashboard)
- **Audio**: Howler.js (sound effects), ElevenLabs (TTS), Web Speech API (fallback)
- **AI**: Gemini 1.5 Flash via `@google/generative-ai`
- **Backend**: Supabase (Auth + DB + Realtime + Storage)
- **Font**: Nunito (Google Fonts)

## Architecture

### File Structure
```
src/
├── App.tsx                    # Root router
├── main.tsx                   # Entry point
├── index.css                  # Design system (CSS variables, animations)
├── components/
│   ├── layout/                # MainLayout, BottomNav
│   ├── ui/                    # Reusable: Button, Card, Modal
│   └── common/                # Mascot, Badge, ProgressBar
├── features/                  # Feature-based modules
│   ├── splash/                # SplashScreen
│   ├── dashboard/             # Student dashboard home
│   ├── vocabulary/            # Topic list + FlashCard study
│   ├── pronunciation/         # Speech recognition + scoring
│   ├── ai-tutor/              # Gemini chat + voice interaction
│   ├── games/                 # Matching, Quiz, Spelling games
│   ├── lessons/               # Cambridge YLE lesson units
│   ├── learning-path/         # Level progression map
│   ├── profile/               # User profile + badges + settings
│   └── reports/               # Parent dashboard + analytics
├── data/                      # Static curriculum data
│   └── vocabularyData.ts      # Cambridge YLE word lists
├── services/                  # API integrations
│   ├── elevenlabs.ts          # ElevenLabs TTS
│   ├── audioCache.ts          # Smart audio caching layer
│   ├── gemini.ts              # Gemini AI chat
│   ├── speech.ts              # Web Speech API
│   └── supabase.ts            # Supabase client
├── stores/
│   └── useAppStore.ts         # Zustand global state
├── types/
│   └── index.ts               # All TypeScript interfaces
└── utils/                     # Helper functions
```

### Design System Conventions
- **Colors**: Use CSS variables (`var(--primary)`, `var(--secondary)`, etc.)
- **Spacing**: Use `var(--sp-xs)` through `var(--sp-2xl)`
- **Border Radius**: Use `var(--radius-sm)` through `var(--radius-pill)`
- **Shadows**: Use `var(--shadow-sm)` through `var(--shadow-lg)`
- **Animations**: Keyframes defined in index.css; complex via Framer Motion
- **Typography**: Nunito font, weights 400/600/700/800/900

### Component Patterns
1. **Each feature** has its own directory with `Page.tsx` + `Page.css`
2. **CSS follows BEM naming**: `.block__element--modifier`
3. **CSS custom properties** for dynamic theming: `style={{ '--color': val }}`
4. **Framer Motion** for page transitions and interactive animations
5. **Mobile-first** design (max-width: 480px container)

### State Management
- **Zustand store** (`useAppStore`) manages: user profile, daily report, badges
- Actions: `addXp()`, `addCoins()`, `incrementStreak()`, `recordLesson()`, etc.
- No Redux, no Context API for global state

### Audio Strategy (ElevenLabs + Caching)
- **Pre-cached phrases** (~120 common sentences) stored in Supabase Storage
- **Vocabulary TTS** generated once per word, cached permanently
- **Dynamic AI responses** generated real-time, cached after first play
- **Fallback**: Web Speech Synthesis API when ElevenLabs quota exhausted
- Budget: 10,000 chars/month free tier

### AI Integration (Gemini)
- System prompt defines "LacLac" persona: friendly, encouraging, simple English
- Responses kept SHORT (1-3 sentences, A1-A2 level)
- Mix Vietnamese for difficult concepts
- Voice interaction via Web Speech API input → Gemini → ElevenLabs output

### Curriculum Data (Cambridge YLE)
- **L0** (Pre-Starter): 100 basic words, ages 4-5
- **L1** (Starters): 300 words, ages 5-6, Pre-A1
- **L2** (Movers): 400 words, ages 7-8, A1
- **L3** (Flyers): 350 words, ages 8-9, A1+
- **L4-L5** (Advanced): 500-600 words, ages 9-12, A2

## Commands
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Key Decisions
- **No TailwindCSS**: Pure CSS for maximum control and smaller bundle
- **No backend required for demo**: Mock data in Zustand store
- **Mobile-first**: 480px max-width, touch-optimized
- **Vietnamese UI**: Navigation and labels in Vietnamese, lessons in English
- **Emoji-first icons**: Using emoji instead of icon library for simplicity
