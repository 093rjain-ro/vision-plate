# Vision Plate

> Vision Plate is a next-gen, AI-powered calorie tracker that makes logging meals effortless. Simply snap a photo, and our advanced vision AI instantly identifies the food and breaks down your macros. Track your progress, maintain daily habit streaks, and hit your fitness goals within a beautifully sleek, dark-mode dashboard.

## Features

- 📸 **AI Food Scanning:** Snap a photo of your meal and let Claude 3.5 Sonnet instantly break down the calories, protein, carbs, and fat.
- 🔥 **Streak & Habit Tracking:** Stay motivated with an interactive 21-day dot calendar and gamified daily streaks.
- 📊 **Advanced Analytics:** Visualize your weekly progress and daily macro distribution through beautiful, custom-built SVG rings and charts.
- 🌙 **Premium Aesthetic:** Designed with a sleek, dark-mode-first interface accented by an electric amber theme (`#F5A623`).
- 📱 **Fully Responsive:** Beautifully adapts from a mobile-friendly bottom tab bar to a dashboard-style desktop sidebar.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Setup (Crucial)

To use the AI scanning feature, you must provide an Anthropic API Key. 

1. Create a `.env.local` file in the root of the project.
2. Add your key: `ANTHROPIC_API_KEY=your_key_here`

If no key is provided, the API route will gracefully return mock data so you can still test the UI flow.

## Tech Stack
- Next.js 14 (App Router)
- React
- Tailwind CSS v4
- Anthropic Claude API (`@anthropic-ai/sdk`)
- Recharts
- Lucide Icons
