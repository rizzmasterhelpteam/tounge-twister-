import React from 'react';
import {
  BarChart3,
  X,
  Flame,
  CheckCircle2,
  Eye,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { UserStats } from '../types';
import { CATEGORIES, TONGUE_TWISTERS } from '../data/twisters';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onResetCycles: () => void;
  onResetAllData: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetCycles,
  onResetAllData,
}) => {
  const [confirmReset, setConfirmReset] = React.useState(false);

  if (!isOpen) return null;

  const totalTwisters = TONGUE_TWISTERS.length;
  const seenCount = stats.seenIds.length;
  const unseenCount = Math.max(0, totalTwisters - seenCount);
  const completedCount = stats.completedIds.length;
  const completionPercentage = Math.round((completedCount / totalTwisters) * 100);
  const accuracyRate =
    stats.totalAttempts > 0 ? Math.round((stats.nailedCount / stats.totalAttempts) * 100) : 0;

  const practiceMinutes = Math.floor(stats.totalPracticeSeconds / 60);
  const practiceSecondsRemaining = stats.totalPracticeSeconds % 60;

  return (
    <div
      id="stats-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                Speech Progress & Stats
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                100% offline & saved locally
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <div className="text-xl font-display font-extrabold text-slate-900 dark:text-amber-300">
                {stats.currentStreak}d
              </div>
              <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                Streak (Best: {stats.bestStreak}d)
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
              <div className="flex items-center justify-center text-emerald-500 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-extrabold text-slate-900 dark:text-emerald-300">
                {completedCount}
              </div>
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Mastered ({completionPercentage}%)
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-center">
              <div className="flex items-center justify-center text-blue-500 mb-1">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-extrabold text-slate-900 dark:text-blue-300">
                {accuracyRate}%
              </div>
              <div className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Nailed Rate
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-center">
              <div className="flex items-center justify-center text-purple-500 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-extrabold text-slate-900 dark:text-purple-300">
                {practiceMinutes}m {practiceSecondsRemaining}s
              </div>
              <div className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider">
                Practice Time
              </div>
            </div>
          </div>

          {/* Seen vs Unseen Tracking Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Twisters Explored</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {seenCount} seen • {unseenCount} fresh
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(completedCount / totalTwisters) * 100}%` }}
                title={`Mastered: ${completedCount}`}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, seenCount - completedCount) / totalTwisters) * 100}%`,
                }}
                title={`Seen: ${seenCount - completedCount}`}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Mastered ({completedCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Seen in drills ({Math.max(0, seenCount - completedCount)})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
                Unseen ({unseenCount})
              </span>
            </div>
          </div>

          {/* Category Mastery Progress */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mastery by Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'favorites').map((cat) => {
                const twistersInCat = TONGUE_TWISTERS.filter(
                  (t) => t.category === cat.id || t.additionalCategories?.includes(cat.id)
                );
                const total = twistersInCat.length;
                const completed = twistersInCat.filter((t) =>
                  stats.completedIds.includes(t.id)
                ).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{cat.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {completed}/{total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Controls: Reset Cycles & Reset Data */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onResetCycles}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Category Queue</span>
            </button>

            {confirmReset ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-rose-600 font-bold">Wipe all stats?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
              >
                Clear Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
