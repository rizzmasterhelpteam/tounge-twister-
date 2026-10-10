export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

export type CategoryId =
  | 'all'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'extreme'
  | 'funny'
  | 'kids'
  | 'short'
  | 'long'
  | 'r-l'
  | 's-sh'
  | 't-d'
  | 'mixed-sound'
  | 'favorites';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
  accentBg: string;
  gradient: string;
}

export interface TongueTwister {
  id: string;
  text: string;
  category: CategoryId;
  additionalCategories?: CategoryId[];
  difficulty: Difficulty;
  soundFocus: string; // e.g. "R / L", "S / Sh", "T / D", "Plosives", "F / V"
  targetSeconds: number; // recommended target practice time
  tip?: string;
  funFact?: string;
  wordCount: number;
}

export type PracticeMode = 'standard' | 'timer' | 'three-times' | 'speed';

export interface PracticeAttempt {
  twisterId: string;
  timestamp: number;
  result: 'nailed' | 'passed' | 'retrying';
  mode: PracticeMode;
  secondsTaken: number;
}

export interface UserStats {
  completedIds: string[];
  seenIds: string[];
  favoriteIds: string[];
  totalAttempts: number;
  nailedCount: number;
  currentStreak: number;
  bestStreak: number;
  comboStreak: number;
  bestCombo: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyChallengeCompletedDate: string;
  history: PracticeAttempt[];
  totalPracticeSeconds: number;
  categoryCycles: Record<string, string[]>; // categoryId -> remaining unviewed IDs
  completedChallengesSinceAd: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark';
}

export type AppTab = 'home' | 'practice' | 'favorites' | 'stats';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'speed' | 'mastery';
  isUnlocked: (stats: UserStats) => boolean;
  getProgress: (stats: UserStats) => { current: number; max: number };
}
