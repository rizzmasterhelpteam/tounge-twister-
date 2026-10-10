import React from 'react';
import {
  BarChart3,
  Flame,
  CheckCircle2,
  Eye,
  Clock,
  RotateCcw,
  Zap,
  Trophy,
  Award,
  Lock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { UserStats } from '../types';
import { CATEGORIES, TONGUE_TWISTERS, isTwisterInCategory } from '../data/twisters';
import { BADGES } from '../data/badges';
import { sound } from '../utils/sound';

interface StatsScreenProps {
  stats: UserStats;
  onResetCycles: () => void;
  onResetAllData: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  stats,
  onResetCycles,
  onResetAllData,
}) => {
  const [badgeFilter, setBadgeFilter] = React.useState<'all' | 'unlocked' | 'locked'>('all');
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [resetFeedback, setResetFeedback] = React.useState<string | null>(null);

  const totalTwisters = TONGUE_TWISTERS.length;
  const seenCount = stats.seenIds.length;
  const unseenCount = Math.max(0, totalTwisters - seenCount);
  const completedCount = stats.completedIds.length;
  const completionPercentage = Math.round((completedCount / totalTwisters) * 100);
  const accuracyRate =
    stats.totalAttempts > 0 ? Math.round((stats.nailedCount / stats.totalAttempts) * 100) : 0;

  const practiceMinutes = Math.floor(stats.totalPracticeSeconds / 60);
  const practiceSecondsRemaining = stats.totalPracticeSeconds % 60;

  const unlockedBadgesCount = BADGES.filter((b) => b.isUnlocked(stats)).length;

  const filteredBadges = React.useMemo(() => {
    return BADGES.filter((b) => {
      const unlocked = b.isUnlocked(stats);
      if (badgeFilter === 'unlocked') return unlocked;
      if (badgeFilter === 'locked') return !unlocked;
      return true;
    });
  }, [stats, badgeFilter]);

  const handleResetCycles = () => {
    sound.playPop(stats.soundEnabled);
    onResetCycles();
    setResetFeedback('Category queues reset! Fresh sequence enabled.');
    setTimeout(() => setResetFeedback(null), 3000);
  };

  const handleResetAll = () => {
    sound.playPop(stats.soundEnabled);
    onResetAllData();
    setConfirmReset(false);
    setResetFeedback('All progress cleared.');
    setTimeout(() => setResetFeedback(null), 3000);
  };

  return (
    <div id="stats-screen-container" className="w-full space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-black text-slate-900 dark:text-white">
              Speech Analytics & Badges
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              100% offline & stored securely on device
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/50 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{unlockedBadgesCount} / {BADGES.length} Badges</span>
        </div>
      </div>

      {resetFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 text-center animate-in fade-in">
          {resetFeedback}
        </div>
      )}

      {/* Top KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
          <div className="flex items-center justify-center text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            {stats.currentStreak}d
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Streak (Best: {stats.bestStreak}d)
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
          <div className="flex items-center justify-center text-emerald-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            {completedCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Mastered ({completionPercentage}%)
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
          <div className="flex items-center justify-center text-blue-500 mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            {stats.bestCombo || stats.comboStreak || 0}×
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Max Combo Streak
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center space-y-0.5">
          <div className="flex items-center justify-center text-purple-500 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            {practiceMinutes}m {practiceSecondsRemaining}s
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Practice Time
          </div>
        </div>
      </div>

      {/* Progress Breakdown Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white">
            Library Coverage
          </span>
          <span className="text-slate-500">
            {completedCount} / {totalTwisters} Twisters
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(completedCount / totalTwisters) * 100}%` }}
            title={`Mastered: ${completedCount}`}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(Math.max(0, seenCount - completedCount) / totalTwisters) * 100}%` }}
            title={`Practiced: ${Math.max(0, seenCount - completedCount)}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mastered ({completedCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Practiced ({Math.max(0, seenCount - completedCount)})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>Unseen ({unseenCount})</span>
          </span>
        </div>
      </div>

      {/* Achievements & Badges Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
              Badges & Achievements
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            {(['all', 'unlocked', 'locked'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBadgeFilter(mode)}
                className={`px-2 py-0.5 rounded capitalize cursor-pointer transition-colors ${
                  badgeFilter === mode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked(stats);
            const prog = badge.getProgress(stats);
            const pct = Math.min(100, Math.round((prog.current / prog.max) * 100));

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300/70 dark:border-amber-900/50 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/60 opacity-80'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800'
                      : 'bg-slate-200/70 dark:bg-slate-800 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isUnlocked
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </h4>

                    {isUnlocked ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5 shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        {prog.current}/{prog.max}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {badge.description}
                  </p>

                  {/* Progress bar if not unlocked */}
                  {!isUnlocked && (
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Mastery Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Level Mastery
        </h3>

        <div className="space-y-2.5">
          {CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'favorites').map((cat) => {
            const catTwisters = TONGUE_TWISTERS.filter((t) =>
              isTwisterInCategory(t, cat.id)
            );
            const catCompleted = catTwisters.filter((t) =>
              stats.completedIds.includes(t.id)
            ).length;
            const catTotal = catTwisters.length;
            const pct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {catCompleted}/{catTotal} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Storage & Data Maintenance */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Device Data Maintenance
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleResetCycles}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Category Queues</span>
          </button>

          {confirmReset ? (
            <div className="flex-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Delete All
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
