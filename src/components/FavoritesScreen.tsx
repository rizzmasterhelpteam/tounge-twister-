import React from 'react';
import { Heart, Search, Play, Zap, Trash2, ArrowRight, Sparkles, X } from 'lucide-react';
import { TongueTwister, UserStats } from '../types';
import { TONGUE_TWISTERS, DAILY_TWISTERS } from '../data/twisters';
import { sound } from '../utils/sound';

interface FavoritesScreenProps {
  stats: UserStats;
  onSelectTwister: (twisterId: string) => void;
  onStartChallenge: (twister: TongueTwister) => void;
  onToggleFavorite: (twisterId: string) => void;
  onExplore: () => void;
}

const ALL_TWISTERS_POOL = [...TONGUE_TWISTERS, ...DAILY_TWISTERS];

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  stats,
  onSelectTwister,
  onStartChallenge,
  onToggleFavorite,
  onExplore,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const favoriteTwisters = React.useMemo(() => {
    return ALL_TWISTERS_POOL.filter((t) => stats.favoriteIds.includes(t.id));
  }, [stats.favoriteIds]);

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return favoriteTwisters;
    const q = searchQuery.toLowerCase().trim();
    return favoriteTwisters.filter(
      (t) =>
        t.text.toLowerCase().includes(q) ||
        t.soundFocus.toLowerCase().includes(q) ||
        t.difficulty.toLowerCase().includes(q)
    );
  }, [favoriteTwisters, searchQuery]);

  return (
    <div id="favorites-screen-container" className="w-full space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-display font-black text-slate-900 dark:text-white">
              Starred Favorites
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {favoriteTwisters.length} saved for targeted muscle memory
            </p>
          </div>
        </div>

        {favoriteTwisters.length > 0 && (
          <button
            type="button"
            onClick={() => {
              sound.playPop(stats.soundEnabled);
              onSelectTwister(favoriteTwisters[0].id);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice Queue</span>
          </button>
        )}
      </div>

      {/* Search within Favorites */}
      {favoriteTwisters.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter saved twisters..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* List or Empty State */}
      {favoriteTwisters.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 my-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1 max-w-xs mx-auto">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              No Favorites Saved Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tap the heart icon on any tongue twister card in Practice mode to bookmark tough phrases here for targeted warmup drills!
            </p>
          </div>

          <button
            type="button"
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Find Twisters in Arena</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          No favorites match "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((twister) => {
            const isCompleted = stats.completedIds.includes(twister.id);

            return (
              <div
                key={twister.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-400/60 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                      {twister.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {twister.soundFocus}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(twister.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  "{twister.text}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Target: {twister.targetSeconds}s
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStartChallenge(twister)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Challenge 3×</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTwister(twister.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
