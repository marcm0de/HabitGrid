'use client';

import { useState } from 'react';
import { useHabitStore } from '@/lib/store';
import HabitCard from '@/components/HabitCard';
import TodayView from '@/components/TodayView';
import YearReview from '@/components/YearReview';
import AddHabitModal from '@/components/AddHabitModal';
import DataManager from '@/components/DataManager';
import ThemeToggle from '@/components/ThemeToggle';
import { Plus, Grid3X3 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const habits = useHabitStore((s) => s.habits);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-card-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 size={24} className="text-accent" />
            <h1 className="text-xl font-bold text-foreground">HabitGrid</h1>
          </div>
          <div className="flex items-center gap-2">
            <DataManager />
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-lg transition-colors"
            >
              <Plus size={16} />
              New Habit
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Grid3X3 size={64} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Start tracking your habits
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your first habit and watch your consistency grow with a beautiful
              GitHub-style contribution grid.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Your First Habit
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Today View */}
            <TodayView />

            {/* Year in Review */}
            <YearReview />

            {/* Habit Cards */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          HabitGrid — All data stored locally in your browser.
        </p>
      </footer>

      {/* Add Modal */}
      <AddHabitModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
