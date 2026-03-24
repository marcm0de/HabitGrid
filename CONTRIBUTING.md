# Contributing to HabitGrid

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/marcusfequiere/HabitGrid.git
   cd HabitGrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/            # Next.js app router pages
├── components/     # React components (HabitCard, HabitGrid, TodayView, etc.)
└── lib/            # Zustand store, utilities
```

## How to Contribute

### Adding Features

- All habit data is managed through the Zustand store in `src/lib/store.ts`
- Components live in `src/components/` — each feature gets its own file
- Data is persisted to localStorage via Zustand's `persist` middleware

### Bug Reports & Feature Requests

Open an issue with a clear description and steps to reproduce (for bugs).

### Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes with clear commit messages
3. Ensure `npm run build` passes
4. Open a PR with a description of what changed and why

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Zustand for state management
- Tailwind CSS for styling
- Framer Motion for animations

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
