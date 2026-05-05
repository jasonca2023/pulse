# Pulse - Your Modern News Reader

![Pulse Logo](https://github.com/user-attachments/README/pulse-logo.png)

---

## Overview

Pulse is a sleek, modern news reader application that delivers real-time news headlines from sources around the world directly to your screen. Built with Next.js and powered by the News API, Pulse provides a clean, dark-themed interface inspired by classic newspapers like The New York Times and The Wall Street Journal.

### Key Features

- **Real-time News Headlines**: Fetches live top headlines from US news sources
- **Category Filtering**: Browse news by categories (General, Business, Technology, Sports, Entertainment, Health, Science)
- **Smart Search**: Find articles with relevant results using title search
- **Estimated Read Time**: See how long each article takes to read
- **AI Summaries**: Generate quick summaries for any article with one click
- **Location Detection**: Automatically detects your location for relevant news
- **Dark Theme**: Easy on the eyes with a professional dark UI
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| React | UI library |
| TypeScript | Type safety |
| News API | News data source |
| CSS Modules | Styling |
| ipapi.co | Location detection |

---

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **News API Key** - Get one free at [newsapi.org](https://newsapi.org/register)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jasonca2023/pulse.git
cd pulse
```

### 2. Install Dependencies

```bash
npm install
```

Or if using Yarn:

```bash
yarn install
```

### 3. Configure Your API Key

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your News API key:

```
NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here
NEWS_API_KEY=your_api_key_here
```

**Important**: Never commit your `.env.local` file to version control. It's already in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
pulse/
├── .env.example          # Example environment variables
├── .env.local           # Your local environment (not committed)
├── .gitignore          # Git ignore rules
├── next.config.js       # Next.js configuration
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── README.md         # This file
└── src/
    ├── app/
    │   ├── api/
    │   │   └── news/
    │   │       └── route.ts    # News API proxy endpoint
    │   ├── globals.css        # Global styles
    │   ├── layout.tsx        # Root layout
    │   ├── page.tsx          # Home page
    │   └── page.module.css   # Page-specific styles
    ├── components/
    │   ├── NewsFeed.tsx          # Main news feed component
    │   └── PulseLogo.tsx         # Pulse logo SVG
    └── types/
        └── index.ts          # TypeScript type definitions
```

---

## How It Works

### 1. News Fetching

The app fetches news from the [News API](https://newsapi.org/) through a server-side API route (`/api/news`) to keep your API key secure.

**Endpoint**: `GET /api/news`

**Parameters**:
- `endpoint` - Either `top-headlines` or `everything`
- `country` - Country code (default: `us`)
- `category` - Category filter (optional)
- `q` - Search query (optional)
- `pageSize` - Number of articles (default: `20`)

### 2. Location Detection

On initial load, the app detects your location using `ipapi.co` and stores your country code. This can be used to show location-relevant news alongside US headlines.

### 3. Category Filtering

Users can filter news by these categories:
- General
- Business
- Technology
- Entertainment
- Health
- Science
- Sports

### 4. AI Summaries

Click the "AI Summary" button on any article card to generate a summary. This currently displays the article description (a real AI summary feature could be added with an LAPI integration).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## API Configuration

### Getting Your News API Key

1. Go to [newsapi.org](https://newsapi.org/register)
2. Create a free account
3. Copy your API key from the dashboard
4. Add it to `.env.local`

### API Rate Limits (Free Plan)

| Limit | Value |
|-------|-------|
| Requests/day | 100 |
| Results/request | 100 |

---

## Customization

### Changing the Theme Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --background: #0a0a0a;    /* Main background */
  --foreground: #fafafa; /* Main text color */
  --card: #141414;        /* Card background */
  --border: #262626;      /* Border color */
  --accent: #e5e5e5;     /* Accent color */
}
```

### Adding More Categories

Edit `src/types/index.ts` to add more categories:

```typescript
export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general', label: 'General' },
  // Add more here...
];
```

---

## Troubleshooting

### "Failed to fetch news" Error

**Cause**: Invalid API key or reached rate limit

**Solution**:
1. Verify your API key in `.env.local`
2. Check [newsapi.org](https://newsapi.org/) for your usage
3. Wait until midnight UTC if you've reached the daily limit

### Port Already in Use

**Cause**: Another process is using port 3000

**Solution**:
```bash
npx kill-port 3000
# Or
npm run dev -- -p 3001
```

---

## Contributing

This is a personal project, but feel free to fork it and make your own modifications.

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [News API](https://newsapi.org/) for providing news data
- [ipapi.co](https://ipapi.co/) for location detection
- Inspired by [The New York Times](https://nytimes.com/) and [The Wall Street Journal](https://wsj.com/)

---

## License