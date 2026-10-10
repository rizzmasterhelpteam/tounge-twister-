import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { TwisterCard } from './components/TwisterCard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { StatsScreen } from './components/StatsScreen';
import { ChallengeModal } from './components/ChallengeModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { HelpModal } from './components/HelpModal';
import { AdMobBanner, AdMobInterstitial } from './components/AdMobBanner';
import { MascotMood } from './components/TwistyMascot';
import { TONGUE_TWISTERS, DAILY_TWISTERS, isTwisterInCategory } from './data/twisters';
import { AppTab, CategoryId, PracticeMode, TongueTwister, UserStats } from './types';
import {
  loadUserStats,
  saveUserStats,
  recordAttempt,
  getTodayDateString,
} from './utils/storage';
import { sound } from './utils/sound';
import confetti from 'canvas-confetti';

export default function App() {
  const [stats, setStats] = React.useState<UserStats>(loadUserStats);
  const [currentTab, setCurrentTab] = React.useState<AppTab>('home');
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryId>('all');
  const [isRandom, setIsRandom] = React.useState<boolean>(false);
  const [currentTwisterIndex, setCurrentTwisterIndex] = React.useState<number>(0);
  const [cycleNotice, setCycleNotice] = React.useState<string | null>(null);
  const [mascotMood, setMascotMood] = React.useState<MascotMood>('idle');

  // Modals
  const [isDailyOpen, setIsDailyOpen] = React.useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState<boolean>(false);
  const [isChallengeOpen, setIsChallengeOpen] = React.useState<boolean>(false);
  const [challengeTargetTwister, setChallengeTargetTwister] = React.useState<TongueTwister | null>(null);
  const [showInterstitial, setShowInterstitial] = React.useState<boolean>(false);

  // Sync theme with HTML root class
  React.useEffect(() => {
    if (stats.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [stats.theme]);

  // Compute filtered twisters for active category
  const filteredTwisters = React.useMemo(() => {
    if (selectedCategory === 'favorites') {
      const favs = TONGUE_TWISTERS.filter((t) => stats.favoriteIds.includes(t.id));
      return favs.length > 0 ? favs : TONGUE_TWISTERS.slice(0, 1);
    }
    if (selectedCategory === 'all') {
      return TONGUE_TWISTERS;
    }
    const filtered = TONGUE_TWISTERS.filter((t) =>
      isTwisterInCategory(t, selectedCategory)
    );
    return filtered.length > 0 ? filtered : TONGUE_TWISTERS;
  }, [selectedCategory, stats.favoriteIds]);

  const currentPoolIds = React.useMemo(
    () => filteredTwisters.map((t) => t.id),
    [filteredTwisters]
  );

  const cycleCount = Math.max(
    1,
    Math.floor(
      stats.seenIds.filter((id) => currentPoolIds.includes(id)).length /
        Math.max(1, currentPoolIds.length)
    ) + 1
  );

  const currentTwister: TongueTwister =
    filteredTwisters[currentTwisterIndex] || filteredTwisters[0] || TONGUE_TWISTERS[0];

  // Daily Challenge deterministic twister based on today's date using dedicated pool
  const dailyTwister = React.useMemo(() => {
    const todayStr = getTodayDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const pool = DAILY_TWISTERS.length > 0 ? DAILY_TWISTERS : TONGUE_TWISTERS;
    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }, []);

  // Mark twister as seen immediately when loaded in practice
  React.useEffect(() => {
    if (currentTab !== 'practice' || !currentTwister) return;
    if (!stats.seenIds.includes(currentTwister.id)) {
      setStats((prev) => {
        const updated = {
          ...prev,
          seenIds: [...prev.seenIds, currentTwister.id],
        };
        saveUserStats(updated);
        return updated;
      });
    }
  }, [currentTab, currentTwister?.id]);

  // Next Twister (No repeats until category cycles)
  const handleNext = React.useCallback(() => {
    sound.playPop(stats.soundEnabled);

    let remaining = stats.categoryCycles[selectedCategory] || [];

    if (remaining.length === 0) {
      remaining = [...currentPoolIds];
      setCycleNotice('🎉 Arena Cycled! Starting fresh round without repeats!');
      setMascotMood('cheering');
      setTimeout(() => setCycleNotice(null), 3200);
      setTimeout(() => setMascotMood('idle'), 2500);
    }

    let candidates = remaining.filter((id) => id !== currentTwister.id);
    if (candidates.length === 0) {
      remaining = [...currentPoolIds];
      candidates = remaining.filter((id) => id !== currentTwister.id);
      if (candidates.length === 0) candidates = [currentTwister.id];
    }

    let nextId: string;
    if (isRandom) {
      const randIdx = Math.floor(Math.random() * candidates.length);
      nextId = candidates[randIdx];
    } else {
      nextId = candidates[0];
    }

    const targetIdx = filteredTwisters.findIndex((t) => t.id === nextId);
    setCurrentTwisterIndex(
      targetIdx !== -1 ? targetIdx : (currentTwisterIndex + 1) % filteredTwisters.length
    );

    const updatedRemaining = remaining.filter((id) => id !== nextId);
    setStats((prev) => {
      const updated = {
        ...prev,
        categoryCycles: {
          ...prev.categoryCycles,
          [selectedCategory]: updatedRemaining,
        },
      };
      saveUserStats(updated);
      return updated;
    });
  }, [
    stats.categoryCycles,
    stats.soundEnabled,
    selectedCategory,
    currentPoolIds,
    currentTwister?.id,
    isRandom,
    filteredTwisters,
    currentTwisterIndex,
  ]);

  // Previous Twister
  const handlePrev = React.useCallback(() => {
    sound.playPop(stats.soundEnabled);
    setCurrentTwisterIndex((prev) =>
      prev === 0 ? filteredTwisters.length - 1 : prev - 1
    );
  }, [stats.soundEnabled, filteredTwisters.length]);

  // Favorite toggle
  const handleToggleFavorite = (twisterId?: string) => {
    const idToToggle = twisterId || currentTwister.id;
    sound.playPop(stats.soundEnabled);
    setStats((prev) => {
      const isFav = prev.favoriteIds.includes(idToToggle);
      const newFavs = isFav
        ? prev.favoriteIds.filter((id) => id !== idToToggle)
        : [...prev.favoriteIds, idToToggle];
      const updated = { ...prev, favoriteIds: newFavs };
      saveUserStats(updated);
      return updated;
    });
  };

  // Switch category
  const handleSelectCategory = (cat: CategoryId) => {
    sound.playPop(stats.soundEnabled);
    setSelectedCategory(cat);
    setCurrentTwisterIndex(0);
  };

  // Record practice attempt
  const handleRecordAttempt = (
    result: 'nailed' | 'passed' | 'retrying',
    mode: PracticeMode,
    secondsTaken: number,
    targetTwisterId?: string
  ) => {
    const id = targetTwisterId || currentTwister.id;
    const isTodayDaily = id === dailyTwister.id;
    const { updatedStats, triggeredAd } = recordAttempt(stats, {
      twisterId: id,
      timestamp: Date.now(),
      result,
      mode,
      secondsTaken,
    });

    let finalStats = updatedStats;
    if (isTodayDaily && (result === 'nailed' || result === 'passed')) {
      finalStats = {
        ...updatedStats,
        dailyChallengeCompletedDate: getTodayDateString(),
      };
      saveUserStats(finalStats);
    }

    setStats(finalStats);

    // Update Mascot Mood
    if (result === 'nailed') {
      setMascotMood('cheering');
      setTimeout(() => setMascotMood('idle'), 3000);
    } else if (result === 'retrying') {
      setMascotMood('flubbed');
      setTimeout(() => setMascotMood('idle'), 2500);
    }

    // Trigger AdMob Interstitial if milestone threshold reached
    if (triggeredAd) {
      setTimeout(() => {
        setShowInterstitial(true);
      }, 700);
    }
  };

  const handleToggleMastered = () => {
    const isCurrentlyCompleted = stats.completedIds.includes(currentTwister.id);
    if (isCurrentlyCompleted) {
      const newCompleted = stats.completedIds.filter((id) => id !== currentTwister.id);
      const updated: UserStats = {
        ...stats,
        completedIds: newCompleted,
      };
      saveUserStats(updated);
      setStats(updated);
      sound.playPop(stats.soundEnabled);
    } else {
      handleRecordAttempt('nailed', 'standard', currentTwister.targetSeconds);
      sound.playSuccess(stats.soundEnabled);
      sound.vibrate([60, 60, 180], stats.hapticsEnabled);
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore
      }
    }
  };

  // Launch Speed Challenge
  const handleOpenChallenge = (twisterToChallenge?: TongueTwister) => {
    sound.playPop(stats.soundEnabled);
    setChallengeTargetTwister(twisterToChallenge || currentTwister);
    setIsChallengeOpen(true);
  };

  // Start twisting from home screen
  const handleStartTwisting = (category?: CategoryId, specificTwisterId?: string) => {
    const targetCat = category || 'all';
    setSelectedCategory(targetCat);
    if (specificTwisterId) {
      const pool = TONGUE_TWISTERS.filter((t) => isTwisterInCategory(t, targetCat));
      const idx = pool.findIndex((t) => t.id === specificTwisterId);
      if (idx !== -1) {
        setCurrentTwisterIndex(idx);
      } else {
        setSelectedCategory('all');
        const allIdx = TONGUE_TWISTERS.findIndex((t) => t.id === specificTwisterId);
        setCurrentTwisterIndex(allIdx !== -1 ? allIdx : 0);
      }
    } else {
      setCurrentTwisterIndex(0);
    }
    setCurrentTab('practice');
  };

  const handleStartDailyPractice = () => {
    sound.playPop(stats.soundEnabled);
    setChallengeTargetTwister(dailyTwister);
    setIsChallengeOpen(true);
  };

  const handleResetCycles = () => {
    sound.playPop(stats.soundEnabled);
    setStats((prev) => {
      const updated = {
        ...prev,
        categoryCycles: {},
      };
      saveUserStats(updated);
      return updated;
    });
    setCycleNotice('All category queues reset! Ready for fresh cycles.');
    setTimeout(() => setCycleNotice(null), 3000);
  };

  const handleResetAllData = () => {
    sound.playPop(stats.soundEnabled);
    const cleanStats: UserStats = {
      completedIds: [],
      seenIds: [currentTwister.id],
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
      soundEnabled: stats.soundEnabled,
      hapticsEnabled: stats.hapticsEnabled,
      theme: stats.theme,
    };
    saveUserStats(cleanStats);
    setStats(cleanStats);
  };

  const handleToggleTheme = () => {
    sound.playPop(stats.soundEnabled);
    const nextTheme: 'light' | 'dark' = stats.theme === 'dark' ? 'light' : 'dark';
    setStats((prev) => {
      const updated: UserStats = { ...prev, theme: nextTheme };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleToggleSound = () => {
    const nextVal = !stats.soundEnabled;
    if (nextVal) sound.playPop(true);
    setStats((prev) => {
      const updated = { ...prev, soundEnabled: nextVal };
      saveUserStats(updated);
      return updated;
    });
  };

  // Keyboard navigation when in practice tab
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDailyOpen || isHelpOpen || isChallengeOpen || showInterstitial) {
        if (e.key === 'Escape') {
          setIsDailyOpen(false);
          setIsHelpOpen(false);
          setIsChallengeOpen(false);
          setShowInterstitial(false);
        }
        return;
      }

      if (currentTab === 'practice') {
        if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNext,
    handlePrev,
    isDailyOpen,
    isHelpOpen,
    isChallengeOpen,
    showInterstitial,
    currentTab,
  ]);

  const isFav = stats.favoriteIds.includes(currentTwister.id);
  const isComp = stats.completedIds.includes(currentTwister.id);
  const isSeen = stats.seenIds.includes(currentTwister.id);

  return (
    <div
      id="tongue-twisters-app-root"
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200"
    >
      {/* Top Application Bar with Mascot */}
      <Header
        stats={stats}
        mascotMood={mascotMood}
        onOpenStats={() => {
          sound.playPop(stats.soundEnabled);
          setCurrentTab('stats');
        }}
        onOpenDaily={() => {
          sound.playPop(stats.soundEnabled);
          setIsDailyOpen(true);
        }}
        onOpenHelp={() => {
          sound.playPop(stats.soundEnabled);
          setIsHelpOpen(true);
        }}
        onToggleSound={handleToggleSound}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Tab Content Viewport */}
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-start px-3 sm:px-4 py-2 sm:py-3 overflow-y-auto">
        {/* Cycle notice toast */}
        {cycleNotice && (
          <div className="mb-2 p-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs text-center font-semibold shadow-lg animate-in fade-in duration-200">
            {cycleNotice}
          </div>
        )}

        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <HomeScreen
            stats={stats}
            onStartTwisting={handleStartTwisting}
            onOpenDaily={() => setIsDailyOpen(true)}
            dailyTwister={dailyTwister}
          />
        )}

        {/* TAB 2: PRACTICE */}
        {currentTab === 'practice' && (
          <div className="w-full space-y-2 animate-in fade-in duration-200">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between px-1 pt-0.5">
              <button
                id="back-to-home-btn"
                type="button"
                onClick={() => {
                  sound.playPop(stats.soundEnabled);
                  setCurrentTab('home');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-500" />
                <span>Back to Levels</span>
              </button>

              <span className="text-[11px] font-semibold text-slate-400">
                {filteredTwisters.length} in this level
              </span>
            </div>

            {/* Category Arena Selector */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              stats={stats}
            />

            {/* Centered Twister Card with Motion Transitions & Swipe Gestures */}
            <TwisterCard
              twister={currentTwister}
              isFavorite={isFav}
              isCompleted={isComp}
              isSeen={isSeen}
              onToggleFavorite={() => handleToggleFavorite()}
              onNext={handleNext}
              onPrev={handlePrev}
              isRandom={isRandom}
              onToggleRandom={() => {
                sound.playPop(stats.soundEnabled);
                setIsRandom(!isRandom);
              }}
              currentIndex={currentTwisterIndex}
              totalInPool={filteredTwisters.length}
              cycleCount={cycleCount}
              soundEnabled={stats.soundEnabled}
              onToggleMastered={handleToggleMastered}
              onStartChallenge={() => handleOpenChallenge(currentTwister)}
            />
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {currentTab === 'favorites' && (
          <FavoritesScreen
            stats={stats}
            onSelectTwister={(twisterId) => handleStartTwisting(undefined, twisterId)}
            onStartChallenge={(twister) => handleOpenChallenge(twister)}
            onToggleFavorite={(twisterId) => handleToggleFavorite(twisterId)}
            onExplore={() => setCurrentTab('home')}
          />
        )}

        {/* TAB 4: STATS */}
        {currentTab === 'stats' && (
          <StatsScreen
            stats={stats}
            onResetCycles={handleResetCycles}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Persistent Play Store Compliant AdMob Banner */}
      <AdMobBanner darkMode={stats.theme === 'dark'} />

      {/* Clean Android Bottom Navigation Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        favoritesCount={stats.favoriteIds.length}
        soundEnabled={stats.soundEnabled}
        hapticsEnabled={stats.hapticsEnabled}
      />

      {/* Modals & Overlays */}
      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
        twister={challengeTargetTwister || currentTwister}
        stats={stats}
        onSuccess={(secondsTaken) =>
          handleRecordAttempt('nailed', 'speed', secondsTaken, challengeTargetTwister?.id)
        }
        onFail={(secondsTaken) =>
          handleRecordAttempt('retrying', 'speed', secondsTaken, challengeTargetTwister?.id)
        }
      />

      <DailyChallengeModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        dailyTwister={dailyTwister}
        stats={stats}
        onStartDailyPractice={handleStartDailyPractice}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <AdMobInterstitial
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
      />
    </div>
  );
}
