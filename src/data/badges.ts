import { Badge, UserStats } from '../types';
import { TONGUE_TWISTERS } from './twisters';

export const BADGES: Badge[] = [
  {
    id: 'first_twist',
    title: 'First Twist',
    description: 'Master your very first tongue twister',
    icon: '🎯',
    category: 'milestone',
    isUnlocked: (stats) => stats.completedIds.length >= 1,
    getProgress: (stats) => ({ current: Math.min(1, stats.completedIds.length), max: 1 }),
  },
  {
    id: 'combo_virtuoso',
    title: '3× Combo!',
    description: 'Score 3 consecutive challenge victories',
    icon: '⚡',
    category: 'streak',
    isUnlocked: (stats) => (stats.bestCombo || 0) >= 3,
    getProgress: (stats) => ({ current: Math.min(3, stats.bestCombo || 0), max: 3 }),
  },
  {
    id: 'streak_3',
    title: '3-Day Fire',
    description: 'Keep your practice streak alive for 3 days',
    icon: '🔥',
    category: 'streak',
    isUnlocked: (stats) => stats.bestStreak >= 3,
    getProgress: (stats) => ({ current: Math.min(3, stats.bestStreak), max: 3 }),
  },
  {
    id: 'diction_10',
    title: 'Articulation Ace',
    description: 'Master 10 tongue twisters offline',
    icon: '👅',
    category: 'milestone',
    isUnlocked: (stats) => stats.completedIds.length >= 10,
    getProgress: (stats) => ({ current: Math.min(10, stats.completedIds.length), max: 10 }),
  },
  {
    id: 'streak_7',
    title: 'Week of Fire',
    description: 'Achieve a 7-day consecutive practice streak',
    icon: '🏆',
    category: 'streak',
    isUnlocked: (stats) => stats.bestStreak >= 7,
    getProgress: (stats) => ({ current: Math.min(7, stats.bestStreak), max: 7 }),
  },
  {
    id: 'extreme_master',
    title: 'Extreme Conqueror',
    description: 'Master 3 Hard difficulty tongue twisters',
    icon: '💀',
    category: 'mastery',
    isUnlocked: (stats) => {
      const extremeIds = TONGUE_TWISTERS.filter((t) => t.difficulty === 'Hard' || t.difficulty === 'Extreme').map((t) => t.id);
      const done = stats.completedIds.filter((id) => extremeIds.includes(id)).length;
      return done >= 3;
    },
    getProgress: (stats) => {
      const extremeIds = TONGUE_TWISTERS.filter((t) => t.difficulty === 'Hard' || t.difficulty === 'Extreme').map((t) => t.id);
      const done = stats.completedIds.filter((id) => extremeIds.includes(id)).length;
      return { current: Math.min(3, done), max: 3 };
    },
  },
  {
    id: 'sound_sibilant',
    title: 'S / Sh Wizard',
    description: 'Master 5 sibilant S/Sh sound twisters',
    icon: '🐍',
    category: 'mastery',
    isUnlocked: (stats) => {
      const sIds = TONGUE_TWISTERS.filter(
        (t) => t.soundFocus.toLowerCase().includes('s')
      ).map((t) => t.id);
      const done = stats.completedIds.filter((id) => sIds.includes(id)).length;
      return done >= 5;
    },
    getProgress: (stats) => {
      const sIds = TONGUE_TWISTERS.filter(
        (t) => t.soundFocus.toLowerCase().includes('s')
      ).map((t) => t.id);
      const done = stats.completedIds.filter((id) => sIds.includes(id)).length;
      return { current: Math.min(5, done), max: 5 };
    },
  },
  {
    id: 'sound_liquid',
    title: 'R / L Rolling Pro',
    description: 'Master 5 liquid consonant R/L twisters',
    icon: '🌊',
    category: 'mastery',
    isUnlocked: (stats) => {
      const rlIds = TONGUE_TWISTERS.filter(
        (t) => t.soundFocus.toLowerCase().includes('r') || t.soundFocus.toLowerCase().includes('l')
      ).map((t) => t.id);
      const done = stats.completedIds.filter((id) => rlIds.includes(id)).length;
      return done >= 5;
    },
    getProgress: (stats) => {
      const rlIds = TONGUE_TWISTERS.filter(
        (t) => t.soundFocus.toLowerCase().includes('r') || t.soundFocus.toLowerCase().includes('l')
      ).map((t) => t.id);
      const done = stats.completedIds.filter((id) => rlIds.includes(id)).length;
      return { current: Math.min(5, done), max: 5 };
    },
  },
  {
    id: 'twister_25',
    title: 'Silver Tongue',
    description: 'Master 25 tongue twisters across all levels',
    icon: '🥈',
    category: 'milestone',
    isUnlocked: (stats) => stats.completedIds.length >= 25,
    getProgress: (stats) => ({ current: Math.min(25, stats.completedIds.length), max: 25 }),
  },
  {
    id: 'marathon_speaker',
    title: 'Vocal Stamina',
    description: 'Log 5 minutes (300s) of active voice practice',
    icon: '⏱️',
    category: 'speed',
    isUnlocked: (stats) => stats.totalPracticeSeconds >= 300,
    getProgress: (stats) => ({ current: Math.min(300, stats.totalPracticeSeconds), max: 300 }),
  },
  {
    id: 'fav_collector',
    title: 'Curator',
    description: 'Save at least 5 favorites for targeted repetition',
    icon: '⭐',
    category: 'milestone',
    isUnlocked: (stats) => stats.favoriteIds.length >= 5,
    getProgress: (stats) => ({ current: Math.min(5, stats.favoriteIds.length), max: 5 }),
  },
  {
    id: 'twister_50',
    title: 'Golden Orator',
    description: 'Master 50 tongue twisters for supreme clarity',
    icon: '👑',
    category: 'milestone',
    isUnlocked: (stats) => stats.completedIds.length >= 50,
    getProgress: (stats) => ({ current: Math.min(50, stats.completedIds.length), max: 50 }),
  },
];
