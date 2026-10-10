import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Flame,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import { TongueTwister, UserStats } from '../types';
import { getTodayDateString } from '../utils/storage';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyTwister: TongueTwister;
  stats: UserStats;
  onStartDailyPractice: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  dailyTwister,
  stats,
  onStartDailyPractice,
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayDateString();
  const isCompletedToday = stats.dailyChallengeCompletedDate === todayStr;

  return (
    <div
      id="daily-challenge-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative">
        {/* Banner with Gold & Flame Accent */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider">
              Daily Articulation
            </span>
            <div className="flex items-center gap-1 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{stats.currentStreak} Day Streak</span>
            </div>
          </div>

          <h3 className="text-xl font-display font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 fill-white" />
            <span>Twister of the Day</span>
          </h3>
          <p className="text-xs text-amber-100 mt-0.5 font-medium">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/80 dark:border-amber-800/60">
              {dailyTwister.difficulty} Difficulty
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Sound: {dailyTwister.soundFocus}</span>
            </span>
          </div>

          {/* Twister text box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center relative">
            <p className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              "{dailyTwister.text}"
            </p>
          </div>

          {dailyTwister.tip && (
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-amber-200/60 dark:border-slate-700">
              <strong className="text-amber-900 dark:text-amber-300 font-bold">
                Coach Tip:{' '}
              </strong>
              {dailyTwister.tip}
            </p>
          )}

          {/* Status / CTA */}
          {isCompletedToday ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Today's Challenge Mastered!</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Streak is protected for today. Great articulation practice!
              </p>
            </div>
          ) : (
            <button
              id="start-daily-practice-btn"
              type="button"
              onClick={() => {
                onStartDailyPractice();
                onClose();
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm tracking-wide shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Practice Today's Twister</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
