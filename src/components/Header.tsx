import React from 'react';
import {
  Flame,
  BarChart3,
  Calendar,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  HelpCircle,
} from 'lucide-react';
import { UserStats } from '../types';
import { getTodayDateString } from '../utils/storage';
import { TwistyMascot, MascotMood } from './TwistyMascot';

interface HeaderProps {
  stats: UserStats;
  mascotMood: MascotMood;
  onOpenStats: () => void;
  onOpenDaily: () => void;
  onOpenHelp: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  mascotMood,
  onOpenStats,
  onOpenDaily,
  onOpenHelp,
  onToggleSound,
  onToggleTheme,
}) => {
  const isDailyDoneToday = stats.dailyChallengeCompletedDate === getTodayDateString();

  return (
    <header
      id="app-top-header"
      className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Interactive Mascot & Title */}
        <TwistyMascot
          mood={mascotMood}
          streakCount={stats.currentStreak}
          soundEnabled={stats.soundEnabled}
          hapticsEnabled={stats.hapticsEnabled}
        />

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Daily Challenge Pill */}
          <button
            id="daily-challenge-btn"
            type="button"
            onClick={onOpenDaily}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
              isDailyDoneToday
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs shadow-orange-500/25 hover:brightness-105'
            }`}
            title="Daily Challenge"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden xs:inline font-semibold">Daily</span>
            {!isDailyDoneToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            )}
          </button>

          {/* Streak Indicator */}
          <div
            id="streak-indicator"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200/70 dark:border-orange-900/40 shadow-2xs select-none"
            title={`Current practice streak: ${stats.currentStreak} day(s)`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{stats.currentStreak}</span>
          </div>

          {/* Stats Button */}
          <button
            id="open-stats-btn"
            type="button"
            onClick={onOpenStats}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer active:scale-95"
            title="Practice statistics & progress"
            aria-label="Progress Stats"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer active:scale-95 border ${
              stats.soundEnabled
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={stats.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle Sound"
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="toggle-theme-btn"
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer active:scale-95"
            title={`Switch to ${stats.theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle Theme"
          >
            {stats.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Help */}
          <button
            id="open-help-btn"
            type="button"
            onClick={onOpenHelp}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
            title="Speech Tips & About"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
