'use client';

import { useState } from 'react';
import { useHabitStore, Habit } from '@/lib/store';
import HabitGrid from './HabitGrid';
import { Flame, Trophy, Calendar, TrendingUp, Star, Trash2, Edit3, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const {
    removeHabit,
    editHabit,
    isCompleted,
    toggleCompletion,
    getCurrentStreak,
    getLongestStreak,
    getWeeklyCompletion,
    getMonthlyCompletion,
    getTotalCompletions,
    getBestDay,
  } = useHabitStore();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editGoal, setEditGoal] = useState(habit.goal);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const completedToday = isCompleted(habit.id, todayStr);
  const currentStreak = getCurrentStreak(habit.id);
  const longestStreak = getLongestStreak(habit.id);
  const weeklyPct = getWeeklyCompletion(habit.id);
  const monthlyPct = getMonthlyCompletion(habit.id);
  const totalDone = getTotalCompletions(habit.id);
  const bestDay = getBestDay(habit.id);

  const handleSaveEdit = () => {
    editHabit(habit.id, { name: editName, goal: editGoal });
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-card-border rounded-xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          {editing ? (
            <div className="flex-1 flex flex-col gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-muted border border-card-border rounded px-2 py-1 text-sm font-semibold"
                autoFocus
              />
              <input
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="bg-muted border border-card-border rounded px-2 py-1 text-xs"
                placeholder="Daily goal..."
              />
              <div className="flex gap-1">
                <button onClick={handleSaveEdit} className="p-1 text-accent hover:text-accent-hover">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditing(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-foreground">{habit.name}</h3>
              {habit.goal && (
                <p className="text-xs text-muted-foreground mt-0.5">{habit.goal}</p>
              )}
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleCompletion(habit.id, todayStr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                completedToday
                  ? 'bg-opacity-20 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-card-border'
              }`}
              style={completedToday ? { backgroundColor: habit.color } : {}}
            >
              {completedToday ? '✓ Done' : 'Complete'}
            </motion.button>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded"
            >
              <Edit3 size={14} />
            </button>
            {showConfirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => removeHabit(habit.id)}
                  className="p-1.5 text-danger hover:text-red-700 rounded text-xs font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 text-muted-foreground hover:text-danger rounded"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <HabitGrid habitId={habit.id} color={habit.color} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
        <StatBadge
          icon={<Flame size={14} />}
          label="Current Streak"
          value={`${currentStreak}d`}
          color={currentStreak > 0 ? habit.color : undefined}
        />
        <StatBadge
          icon={<Trophy size={14} />}
          label="Longest Streak"
          value={`${longestStreak}d`}
        />
        <StatBadge
          icon={<Calendar size={14} />}
          label="This Week"
          value={`${weeklyPct}%`}
        />
        <StatBadge
          icon={<TrendingUp size={14} />}
          label="This Month"
          value={`${monthlyPct}%`}
        />
        <StatBadge
          icon={<Star size={14} />}
          label="Total Days"
          value={`${totalDone}`}
        />
        <StatBadge
          icon={<Calendar size={14} />}
          label="Best Day"
          value={bestDay || '—'}
        />
      </div>
    </motion.div>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
      <span className="text-muted-foreground" style={color ? { color } : {}}>
        {icon}
      </span>
      <div>
        <div className="text-xs font-medium" style={color ? { color } : {}}>
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
