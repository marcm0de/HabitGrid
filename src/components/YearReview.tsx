'use client';

import { useHabitStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Trophy, Calendar, Target } from 'lucide-react';

export default function YearReview() {
  const { habits, getTotalCompletions, getCurrentStreak, getLongestStreak, getMonthlyCompletion, getYearData } = useHabitStore();

  if (habits.length === 0) return null;

  const totalAllHabits = habits.reduce((sum, h) => sum + getTotalCompletions(h.id), 0);
  const avgMonthly = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + getMonthlyCompletion(h.id), 0) / habits.length)
    : 0;

  // Find the most consistent habit
  let mostConsistent = habits[0];
  let bestRate = 0;
  habits.forEach((h) => {
    const yearData = getYearData(h.id);
    const rate = yearData.filter((d) => d.completed).length / yearData.length;
    if (rate > bestRate) {
      bestRate = rate;
      mostConsistent = h;
    }
  });

  // Combined best streak
  const bestStreak = Math.max(...habits.map((h) => getLongestStreak(h.id)), 0);
  const bestStreakHabit = habits.find((h) => getLongestStreak(h.id) === bestStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-card-border rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Year in Review</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReviewStat
          icon={<Target size={18} />}
          label="Total Completions"
          value={totalAllHabits.toString()}
          sublabel="across all habits"
        />
        <ReviewStat
          icon={<Calendar size={18} />}
          label="Avg Monthly Rate"
          value={`${avgMonthly}%`}
          sublabel="this month"
        />
        <ReviewStat
          icon={<Flame size={18} />}
          label="Best Streak"
          value={`${bestStreak} days`}
          sublabel={bestStreakHabit?.name || ''}
        />
        <ReviewStat
          icon={<Trophy size={18} />}
          label="Most Consistent"
          value={mostConsistent?.name || '—'}
          sublabel={`${Math.round(bestRate * 100)}% completion`}
          color={mostConsistent?.color}
        />
      </div>
    </motion.div>
  );
}

function ReviewStat({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color?: string;
}) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="text-muted-foreground mb-2">{icon}</div>
      <div className="text-lg font-bold text-foreground" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</div>
    </div>
  );
}
