import React from 'react';
import {
  Sparkles,
  Smile,
  Flame,
  Zap,
  Play,
  Search,
  CheckCircle2,
  ArrowRight,
  Trophy,
  X,
} from 'lucide-react';
import { CategoryId, TongueTwister, UserStats } from '../types';
import { CATEGORIES, TONGUE_TWISTERS, isTwisterInCategory } from '../data/twisters';
import { BADGES } from '../data/badges';
import { getTodayDateString } from '../utils/storage';
import { sound } from '../utils/sound';

interface HomeScreenProps {
  stats: UserStats;
  onStartTwisting: (category?: CategoryId, twisterId?: string) => void;
  onOpenDaily: () => void;
  dailyTwister: TongueTwister;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Smile,
  Flame,
  Zap,
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onStartTwisting,
  onOpenDaily,
  dailyTwister,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const todayStr = getTodayDateString();
  const isDailyCompleted = stats.dailyChallengeCompletedDate === todayStr;

  // Filtered twisters when search query is entered
  const filteredTwisters = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;

    return TONGUE_TWISTERS.filter((t) => {
      return (
        t.text.toLowerCase().includes(q) ||
        t.soundFocus.toLowerCase().includes(q) ||
        t.difficulty.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Overall mastered progress
  const totalTwisters = TONGUE_TWISTERS.length;
  const masteredCount = stats.completedIds.length;
  const overallPercentage = Math.round((masteredCount / totalTwisters) * 100);

  // Next badge to unlock
  const nextBadge = React.useMemo(() => {
    return BADGES.find((b) => !b.isUnlocked(stats)) || BADGES[BADGES.length - 1];
  }, [stats]);

  const badgeProg = nextBadge ? nextBadge.getProgress(stats) : { current: 1, max: 1 };

  return (
    <div id="home-screen-container" className="w-full space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Bold Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-5 sm:p-6 text-white shadow-xl">
        {/* Subtle Ambient Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                <span>{stats.currentStreak} Day Streak</span>
              </span>
              {stats.comboStreak > 1 && (
                <span className="px-2.5 py-1 rounded-full bg-black/20 text-xs font-black text-amber-200">
                  ⚡ {stats.comboStreak}× Combo
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-amber-100">
                {masteredCount}/{totalTwisters} Mastered ({overallPercentage}%)
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
              Ready to Twist Your Tongue?
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-1 max-w-sm">
              Practice pronunciation with fast consonant challenges.
            </p>
          </div>

          {/* Giant "Start Twisting" CTA Button */}
          <button
            id="hero-start-twisting-cta"
            type="button"
            onClick={() => {
              sound.playPop(stats.soundEnabled);
              sound.vibrate(40, stats.hapticsEnabled);
              onStartTwisting('all');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-white text-slate-900 font-display font-black text-base sm:text-lg shadow-lg hover:bg-amber-50 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
            <span>Practice All Twisters</span>
            <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Daily Challenge Spotlight Banner */}
      <div
        id="daily-challenge-spotlight-card"
        onClick={() => {
          sound.playPop(stats.soundEnabled);
          onOpenDaily();
        }}
        className="cursor-pointer rounded-2xl bg-slate-900 dark:bg-slate-800 text-white p-4 border border-slate-800 shadow-md hover:border-amber-500/50 transition-all flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Daily Sprint
              </span>
              {isDailyCompleted && (
                <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold truncate max-w-[210px] sm:max-w-xs text-slate-100 group-hover:text-amber-300 transition-colors">
              "{dailyTwister.text}"
            </h3>
            <p className="text-[11px] text-slate-400">
              Focus: {dailyTwister.soundFocus} • {dailyTwister.difficulty}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
        >
          {isDailyCompleted ? 'Replay' : 'Play'}
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="home-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any words, sounds or phrases..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* If Search is Active: Display Results */}
      {filteredTwisters !== null ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
            <span>Search Results ({filteredTwisters.length})</span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          {filteredTwisters.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-3xl">🔍</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                No matching twisters found
              </h4>
              <p className="text-xs text-slate-500">
                Try searching for a different word or sound.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTwisters.slice(0, 15).map((twister) => {
                const isMastered = stats.completedIds.includes(twister.id);
                return (
                  <div
                    key={twister.id}
                    onClick={() => onStartTwisting(twister.category, twister.id)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {twister.difficulty}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {twister.soundFocus}
                        </span>
                        {isMastered && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Mastered
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                        "{twister.text}"
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Just 3 Clear, Consolidated Level Options */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-display font-black text-slate-900 dark:text-white tracking-tight">
              Select Practice Level
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              3 Simple Levels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const Icon = ICON_MAP[cat.iconName] || Sparkles;
              const catTwisters = TONGUE_TWISTERS.filter((t) =>
                isTwisterInCategory(t, cat.id)
              );
              const totalInCat = catTwisters.length;
              const completedInCat = catTwisters.filter((t) =>
                stats.completedIds.includes(t.id)
              ).length;
              const pct = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0;

              return (
                <button
                  key={cat.id}
                  id={`category-card-${cat.id}`}
                  type="button"
                  onClick={() => {
                    sound.playPop(stats.soundEnabled);
                    sound.vibrate(25, stats.hapticsEnabled);
                    onStartTwisting(cat.id);
                  }}
                  className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer flex flex-col justify-between group"
                >
                  {/* Subtle top accent gradient */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cat.gradient}`}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {totalInCat} twisters
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-display font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>Mastery</span>
                      <span>{pct}% ({completedInCat}/{totalInCat})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.gradient}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Achievement / Badge Preview */}
      {nextBadge && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-amber-50/50 dark:from-slate-900 dark:to-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-xl flex items-center justify-center shrink-0">
              {nextBadge.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Target Badge
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {nextBadge.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {nextBadge.description} ({badgeProg.current}/{badgeProg.max})
              </p>
            </div>
          </div>

          <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${Math.round((badgeProg.current / badgeProg.max) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
