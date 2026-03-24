'use client';

import { useHabitStore } from '@/lib/store';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TodayView() {
  const { habits, isCompleted, toggleCompletion } = useHabitStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  if (habits.length === 0) return null;

  const completedCount = habits.filter((h) => isCompleted(h.id, todayStr)).length;
  const allDone = completedCount === habits.length;

  return (
    <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today</h2>
          <p className="text-sm text-muted-foreground">{todayFormatted}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground">
            {completedCount}/{habits.length}
          </span>
          {allDone && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-accent font-medium"
            >
              🎉 All done!
            </motion.p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        {habits.map((habit) => {
          const done = isCompleted(habit.id, todayStr);
          return (
            <motion.button
              key={habit.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCompletion(habit.id, todayStr)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left ${
                done ? 'bg-muted/50' : 'bg-muted hover:bg-card-border/50'
              }`}
            >
              {done ? (
                <CheckCircle2 size={22} style={{ color: habit.color }} />
              ) : (
                <Circle size={22} className="text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium ${
                    done ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {habit.name}
                </span>
                {habit.goal && (
                  <p className="text-xs text-muted-foreground truncate">{habit.goal}</p>
                )}
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
