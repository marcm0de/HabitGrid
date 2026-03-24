import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, differenceInCalendarDays, startOfDay, subDays, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, parseISO } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  color: string;
  goal: string;
  createdAt: string;
}

export interface HabitStore {
  habits: Habit[];
  completions: Record<string, Record<string, boolean>>; // habitId -> dateStr -> completed
  darkMode: boolean;

  addHabit: (name: string, color: string, goal: string) => void;
  removeHabit: (id: string) => void;
  editHabit: (id: string, updates: Partial<Pick<Habit, 'name' | 'color' | 'goal'>>) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
  getCompletedDates: (habitId: string) => Set<string>;
  getCurrentStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
  getWeeklyCompletion: (habitId: string) => number;
  getMonthlyCompletion: (habitId: string) => number;
  getTotalCompletions: (habitId: string) => number;
  getBestDay: (habitId: string) => string | null;
  getYearData: (habitId: string) => { date: string; completed: boolean }[];
  toggleDarkMode: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: {},
      darkMode: false,

      addHabit: (name, color, goal) => {
        const id = generateId();
        set((state) => ({
          habits: [...state.habits, { id, name, color, goal, createdAt: new Date().toISOString() }],
          completions: { ...state.completions, [id]: {} },
        }));
      },

      removeHabit: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.completions;
          return {
            habits: state.habits.filter((h) => h.id !== id),
            completions: rest,
          };
        });
      },

      editHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      toggleCompletion: (habitId, date) => {
        set((state) => {
          const habitCompletions = state.completions[habitId] || {};
          const newVal = !habitCompletions[date];
          return {
            completions: {
              ...state.completions,
              [habitId]: {
                ...habitCompletions,
                [date]: newVal,
              },
            },
          };
        });
      },

      isCompleted: (habitId, date) => {
        return !!get().completions[habitId]?.[date];
      },

      getCompletedDates: (habitId) => {
        const completions = get().completions[habitId] || {};
        return new Set(Object.keys(completions).filter((d) => completions[d]));
      },

      getCurrentStreak: (habitId) => {
        const completions = get().completions[habitId] || {};
        let streak = 0;
        let day = startOfDay(new Date());

        // If today isn't completed, start from yesterday
        const todayStr = format(day, 'yyyy-MM-dd');
        if (!completions[todayStr]) {
          day = subDays(day, 1);
        }

        while (true) {
          const dateStr = format(day, 'yyyy-MM-dd');
          if (completions[dateStr]) {
            streak++;
            day = subDays(day, 1);
          } else {
            break;
          }
        }
        return streak;
      },

      getLongestStreak: (habitId) => {
        const completions = get().completions[habitId] || {};
        const dates = Object.keys(completions)
          .filter((d) => completions[d])
          .sort();

        if (dates.length === 0) return 0;

        let longest = 1;
        let current = 1;

        for (let i = 1; i < dates.length; i++) {
          const diff = differenceInCalendarDays(parseISO(dates[i]), parseISO(dates[i - 1]));
          if (diff === 1) {
            current++;
            longest = Math.max(longest, current);
          } else {
            current = 1;
          }
        }
        return longest;
      },

      getWeeklyCompletion: (habitId) => {
        const completions = get().completions[habitId] || {};
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const completed = days.filter((d) => completions[format(d, 'yyyy-MM-dd')]).length;
        return Math.round((completed / days.length) * 100);
      },

      getMonthlyCompletion: (habitId) => {
        const completions = get().completions[habitId] || {};
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const pastDays = days.filter((d) => d <= now);
        const completed = pastDays.filter((d) => completions[format(d, 'yyyy-MM-dd')]).length;
        return pastDays.length > 0 ? Math.round((completed / pastDays.length) * 100) : 0;
      },

      getTotalCompletions: (habitId) => {
        const completions = get().completions[habitId] || {};
        return Object.values(completions).filter(Boolean).length;
      },

      getBestDay: (habitId) => {
        const completions = get().completions[habitId] || {};
        const dayCounts: Record<string, number> = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        Object.keys(completions)
          .filter((d) => completions[d])
          .forEach((dateStr) => {
            const dayName = dayNames[parseISO(dateStr).getDay()];
            dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
          });

        let bestDay: string | null = null;
        let maxCount = 0;
        Object.entries(dayCounts).forEach(([day, count]) => {
          if (count > maxCount) {
            maxCount = count;
            bestDay = day;
          }
        });
        return bestDay;
      },

      getYearData: (habitId) => {
        const completions = get().completions[habitId] || {};
        const end = new Date();
        const start = subDays(end, 364);
        const days = eachDayOfInterval({ start, end });
        return days.map((d) => {
          const dateStr = format(d, 'yyyy-MM-dd');
          return { date: dateStr, completed: !!completions[dateStr] };
        });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      exportData: () => {
        const { habits, completions } = get();
        return JSON.stringify({ habits, completions, exportedAt: new Date().toISOString() }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.habits && data.completions) {
            set({ habits: data.habits, completions: data.completions });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'habitgrid-storage',
    }
  )
);
