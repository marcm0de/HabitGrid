'use client';

import { useHabitStore } from '@/lib/store';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeeklyCalendar() {
  const habits = useHabitStore((s) => s.habits);
  const { isCompleted, toggleCompletion } = useHabitStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const isFuture = (date: Date) => date > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-card-border rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-accent" />
          <h2 className="font-semibold text-foreground">Weekly View</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-lg bg-muted hover:bg-card-border text-muted-foreground transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1 rounded-lg bg-muted hover:bg-card-border text-xs font-medium text-muted-foreground transition-colors"
          >
            This Week
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            disabled={weekOffset >= 0}
            className="p-1.5 rounded-lg bg-muted hover:bg-card-border text-muted-foreground transition-colors disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Add habits to see your weekly calendar
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4 min-w-[120px]">
                  Habit
                </th>
                {days.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`text-center py-2 px-1 min-w-[48px] ${
                      isToday(day) ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="text-[10px] font-medium uppercase">{format(day, 'EEE')}</div>
                    <div className={`text-xs font-bold ${isToday(day) ? 'bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </th>
                ))}
                <th className="text-center text-xs font-medium text-muted-foreground py-2 pl-3 min-w-[48px]">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {habits.map((habit) => {
                  const weekCompleted = days.filter((d) =>
                    isCompleted(habit.id, format(d, 'yyyy-MM-dd'))
                  ).length;
                  const weekPct = Math.round((weekCompleted / 7) * 100);

                  return (
                    <motion.tr
                      key={habit.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-card-border/50"
                    >
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-sm font-medium text-foreground truncate">
                            {habit.name}
                          </span>
                        </div>
                      </td>
                      {days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const completed = isCompleted(habit.id, dateStr);
                        const future = isFuture(day);

                        return (
                          <td key={dateStr} className="text-center py-2 px-1">
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => !future && toggleCompletion(habit.id, dateStr)}
                              disabled={future}
                              className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all ${
                                future
                                  ? 'bg-muted/30 cursor-not-allowed'
                                  : completed
                                  ? 'shadow-md'
                                  : 'bg-muted hover:bg-card-border cursor-pointer'
                              }`}
                              style={completed ? {
                                backgroundColor: habit.color,
                                boxShadow: `0 2px 8px ${habit.color}40`,
                              } : {}}
                            >
                              {completed && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-white text-xs font-bold"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </motion.button>
                          </td>
                        );
                      })}
                      <td className="text-center py-2 pl-3">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold" style={{ color: weekPct >= 70 ? habit.color : undefined }}>
                            {weekPct}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">{weekCompleted}/7</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
