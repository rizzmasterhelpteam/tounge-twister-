import React from 'react';
import { Sparkles, Smile, Flame, Zap } from 'lucide-react';
import { CATEGORIES, TONGUE_TWISTERS, isTwisterInCategory } from '../data/twisters';
import { CategoryId, UserStats } from '../types';

interface CategorySelectorProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  stats: UserStats;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Smile,
  Flame,
  Zap,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  stats,
}) => {
  const categoryStats = React.useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};

    CATEGORIES.forEach((cat) => {
      const filtered = TONGUE_TWISTERS.filter((t) => isTwisterInCategory(t, cat.id));
      const completed = filtered.filter((t) => stats.completedIds.includes(t.id)).length;
      counts[cat.id] = { total: filtered.length, completed };
    });

    return counts;
  }, [stats.completedIds]);

  return (
    <div id="category-selector-container" className="w-full pt-1 pb-1">
      {/* 4 Clean Options Grid */}
      <div
        id="categories-grid"
        className="grid grid-cols-4 gap-1.5 px-1 sm:px-2"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = ICON_MAP[cat.iconName] || Sparkles;
          const itemStat = categoryStats[cat.id] || { total: 0, completed: 0 };

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 border text-center ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected
                      ? 'text-amber-300 dark:text-amber-600'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="text-xs font-bold leading-none">{cat.name}</span>
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isSelected
                    ? 'text-slate-300 dark:text-slate-600'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {itemStat.completed}/{itemStat.total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
