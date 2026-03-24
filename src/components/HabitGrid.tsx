'use client';

import { useMemo } from 'react';
import { format, parseISO, getDay, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { useHabitStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface HabitGridProps {
  habitId: string;
  color: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColorShades(baseColor: string): string[] {
  // Returns [empty, light, medium, dark, darkest]
  const colorMap: Record<string, string[]> = {
    '#22c55e': ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'], // green
    '#3b82f6': ['#ebedf0', '#9ecaff', '#5b9bf5', '#3b82f6', '#1d4ed8'], // blue
    '#f59e0b': ['#ebedf0', '#fde68a', '#fbbf24', '#f59e0b', '#d97706'], // amber
    '#ef4444': ['#ebedf0', '#fca5a5', '#f87171', '#ef4444', '#dc2626'], // red
    '#8b5cf6': ['#ebedf0', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'], // purple
    '#ec4899': ['#ebedf0', '#f9a8d4', '#f472b6', '#ec4899', '#db2777'], // pink
    '#06b6d4': ['#ebedf0', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2'], // cyan
    '#f97316': ['#ebedf0', '#fdba74', '#fb923c', '#f97316', '#ea580c'], // orange
  };
  return colorMap[baseColor] || colorMap['#22c55e'];
}

function getDarkColorShades(baseColor: string): string[] {
  const colorMap: Record<string, string[]> = {
    '#22c55e': ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    '#3b82f6': ['#161b22', '#0c2d6b', '#1347a4', '#3b82f6', '#60a5fa'],
    '#f59e0b': ['#161b22', '#5c3a08', '#92610d', '#f59e0b', '#fbbf24'],
    '#ef4444': ['#161b22', '#5c1010', '#991b1b', '#ef4444', '#f87171'],
    '#8b5cf6': ['#161b22', '#3b1a7e', '#5b34b5', '#8b5cf6', '#a78bfa'],
    '#ec4899': ['#161b22', '#6b1740', '#9d2468', '#ec4899', '#f472b6'],
    '#06b6d4': ['#161b22', '#0c4a5e', '#0e7490', '#06b6d4', '#22d3ee'],
    '#f97316': ['#161b22', '#5c2c08', '#9a4a0e', '#f97316', '#fb923c'],
  };
  return colorMap[baseColor] || colorMap['#22c55e'];
}

export default function HabitGrid({ habitId, color }: HabitGridProps) {
  const { toggleCompletion, darkMode } = useHabitStore();
  const completions = useHabitStore((s) => s.completions[habitId] || {});

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const end = today;
    // Go back ~52 weeks, starting from the first Sunday
    const rawStart = subDays(end, 364);
    const start = startOfWeek(rawStart, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start, end });

    // Group into weeks (columns)
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [];

    // Fill first week with nulls for days before start
    const startDayOfWeek = getDay(allDays[0]);
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    allDays.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(format(day, 'yyyy-MM-dd'));
    });

    // Pad the last week
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);

    // Calculate month labels
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, colIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const month = parseISO(firstValidDay).getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTHS[month], col: colIdx });
          lastMonth = month;
        }
      }
    });

    return { weeks, monthLabels };
  }, []);

  const shades = darkMode ? getDarkColorShades(color) : getColorShades(color);
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-0.5 min-w-fit">
        {/* Month labels */}
        <div className="flex gap-0.5 ml-8">
          {weeks.map((_, colIdx) => {
            const monthLabel = monthLabels.find((m) => m.col === colIdx);
            return (
              <div
                key={colIdx}
                className="text-[10px] text-muted-foreground"
                style={{ width: 13, height: 14 }}
              >
                {monthLabel?.label || ''}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-muted-foreground flex items-center justify-end"
                style={{ width: 28, height: 13 }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="flex gap-0.5">
            {weeks.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-0.5">
                {week.map((dateStr, rowIdx) => {
                  if (!dateStr) {
                    return <div key={rowIdx} style={{ width: 13, height: 13 }} />;
                  }
                  const completed = !!completions[dateStr];
                  const isFuture = parseISO(dateStr) > new Date();
                  const bgColor = isFuture
                    ? 'transparent'
                    : completed
                    ? shades[3]
                    : shades[0];

                  return (
                    <motion.div
                      key={dateStr}
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => !isFuture && toggleCompletion(habitId, dateStr)}
                      className="rounded-sm cursor-pointer"
                      style={{
                        width: 13,
                        height: 13,
                        backgroundColor: bgColor,
                        border: isFuture ? '1px solid transparent' : 'none',
                      }}
                      title={`${dateStr}${completed ? ' ✓' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 ml-8">
          <span className="text-[10px] text-muted-foreground mr-1">Less</span>
          {shades.map((shade, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{ width: 13, height: 13, backgroundColor: shade }}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">More</span>
        </div>
      </div>
    </div>
  );
}
