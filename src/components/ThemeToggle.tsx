'use client';

import { useHabitStore } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useHabitStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-muted hover:bg-card-border text-muted-foreground hover:text-foreground transition-colors"
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}
