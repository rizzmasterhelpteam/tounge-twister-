import { CategoryId, CategoryInfo, TongueTwister } from '../types';
import { EASY_TWISTERS } from './twisters-easy';
import { TRICKY_TWISTERS } from './twisters-tricky';
import { HARD_TWISTERS } from './twisters-hard';
import { DAILY_TWISTERS } from './twisters-daily';

export { EASY_TWISTERS, TRICKY_TWISTERS, HARD_TWISTERS, DAILY_TWISTERS };

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All',
    description: 'The complete collection across all difficulty tiers (600 twisters)',
    iconName: 'Sparkles',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    accentBg: 'from-amber-500 to-orange-500',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    id: 'easy',
    name: 'Easy',
    description: 'Fun warm-ups, short sprints & playful rhymes (200 twisters)',
    iconName: 'Smile',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    accentBg: 'from-emerald-500 to-teal-500',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'medium',
    name: 'Tricky',
    description: 'Classic rhythm builders & whimsical stories (200 twisters)',
    iconName: 'Flame',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    accentBg: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Fast consonant shifts & extreme tongue-stoppers (200 twisters)',
    iconName: 'Zap',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    accentBg: 'from-rose-500 to-red-600',
    gradient: 'from-rose-500 via-pink-600 to-red-700',
  },
];

export function isTwisterInCategory(twister: TongueTwister, catId: CategoryId): boolean {
  if (catId === 'all') return true;
  if (catId === 'easy') {
    return twister.category === 'easy' || twister.difficulty === 'Easy';
  }
  if (catId === 'medium') {
    return twister.category === 'medium' || twister.difficulty === 'Medium';
  }
  if (catId === 'hard' || catId === 'extreme') {
    return twister.category === 'hard' || twister.difficulty === 'Hard' || twister.difficulty === 'Extreme';
  }
  return false;
}

// 600 twisters in general pool: 200 Easy + 200 Tricky + 200 Hard
export const TONGUE_TWISTERS: TongueTwister[] = [
  ...EASY_TWISTERS,
  ...TRICKY_TWISTERS,
  ...HARD_TWISTERS,
];
