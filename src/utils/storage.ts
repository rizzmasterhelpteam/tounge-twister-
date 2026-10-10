import { PracticeAttempt, UserStats } from '../types';

const STORAGE_KEY = 'tongue_twisters_android_stats_v1';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_STATS: UserStats = {
  completedIds: [],
  seenIds: [],
  favoriteIds: [],
  totalAttempts: 0,
  nailedCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  comboStreak: 0,
  bestCombo: 0,
  lastActiveDate: '',
  dailyChallengeCompletedDate: '',
  history: [],
  totalPracticeSeconds: 0,
  categoryCycles: {},
  completedChallengesSinceAd: 0,
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'light',
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      seenIds: Array.isArray(parsed.seenIds) ? parsed.seenIds : [],
      favoriteIds: Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      categoryCycles: parsed.categoryCycles && typeof parsed.categoryCycles === 'object' ? parsed.categoryCycles : {},
      comboStreak: typeof parsed.comboStreak === 'number' ? parsed.comboStreak : 0,
      bestCombo: typeof parsed.bestCombo === 'number' ? parsed.bestCombo : 0,
    };
  } catch (e) {
    console.error('Error loading stats from localStorage', e);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats to localStorage', e);
  }
}

export function recordAttempt(
  stats: UserStats,
  attempt: PracticeAttempt
): { updatedStats: UserStats; isNewDailyCompletion: boolean; triggeredAd: boolean } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const newAttempts = stats.totalAttempts + 1;
  const isSuccess = attempt.result === 'nailed' || attempt.result === 'passed';
  const newNailedCount = stats.nailedCount + (attempt.result === 'nailed' ? 1 : 0);

  // Update streak
  let newCurrentStreak = stats.currentStreak;
  let newBestStreak = stats.bestStreak;
  let newComboStreak = stats.comboStreak || 0;
  let newBestCombo = stats.bestCombo || 0;

  if (isSuccess) {
    if (stats.lastActiveDate === today) {
      // Already active today, maintain
    } else if (stats.lastActiveDate === yesterday) {
      newCurrentStreak = stats.currentStreak + 1;
    } else {
      newCurrentStreak = 1;
    }
    if (newCurrentStreak > newBestStreak) {
      newBestStreak = newCurrentStreak;
    }
    newComboStreak += 1;
    if (newComboStreak > newBestCombo) {
      newBestCombo = newComboStreak;
    }
  } else if (attempt.result === 'retrying') {
    newComboStreak = 0;
  }

  // Completed IDs
  const completedSet = new Set(stats.completedIds);
  if (isSuccess) {
    completedSet.add(attempt.twisterId);
  }

  // Seen IDs
  const seenSet = new Set(stats.seenIds);
  seenSet.add(attempt.twisterId);

  // AdMob counter: interstitial after 5 completed challenges
  const newChallengesSinceAd = isSuccess ? stats.completedChallengesSinceAd + 1 : stats.completedChallengesSinceAd;
  const triggeredAd = newChallengesSinceAd >= 5;

  const updatedStats: UserStats = {
    ...stats,
    totalAttempts: newAttempts,
    nailedCount: newNailedCount,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    comboStreak: newComboStreak,
    bestCombo: newBestCombo,
    lastActiveDate: isSuccess ? today : stats.lastActiveDate,
    completedIds: Array.from(completedSet),
    seenIds: Array.from(seenSet),
    history: [attempt, ...stats.history].slice(0, 100), // keep latest 100
    totalPracticeSeconds: stats.totalPracticeSeconds + Math.max(1, attempt.secondsTaken),
    completedChallengesSinceAd: triggeredAd ? 0 : newChallengesSinceAd,
  };

  saveUserStats(updatedStats);
  return { updatedStats, isNewDailyCompletion: false, triggeredAd };
}
