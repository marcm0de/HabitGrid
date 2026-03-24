# HabitGrid

A GitHub-style contribution graph for daily habits. Track your consistency with beautiful heatmap visualizations.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **GitHub-style heatmaps** — Each habit gets its own 52-week contribution grid
- **Click to complete** — Toggle any day on the grid
- **Streaks** — Current streak and longest streak tracking
- **Stats** — Weekly/monthly completion percentages, best day analysis
- **Today view** — Quick-complete buttons for all habits
- **Year in review** — Summary stats across all habits
- **Custom colors** — Pick a color for each habit (8 options)
- **Dark/light mode** — Smooth theme switching
- **Import/export** — Backup and restore data as JSON
- **100% local** — All data stored in localStorage, no server needed

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [date-fns](https://date-fns.org/) for date utilities

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/HabitGrid.git
cd HabitGrid

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start tracking.

## Usage

1. Click **New Habit** to add a habit with a name, optional daily goal, and color
2. Click any cell on the heatmap to mark that day as complete
3. Use the **Today** panel for quick daily check-ins
4. Track your streaks and completion rates in the stats bar
5. Export your data anytime with the **Export** button

## Data

All data lives in your browser's `localStorage` under the key `habitgrid-storage`. Use the Export/Import buttons to back up or transfer your data.

## Screenshots

_Coming soon_

## Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## License

[MIT](LICENSE)
