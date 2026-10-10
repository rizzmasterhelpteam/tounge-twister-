import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Copy,
  Share2,
  Check,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TongueTwister, Difficulty } from '../types';
import { sound } from '../utils/sound';

interface TwisterCardProps {
  twister: TongueTwister;
  isFavorite: boolean;
  isCompleted: boolean;
  isSeen: boolean;
  onToggleFavorite: () => void;
  onNext: () => void;
  onPrev: () => void;
  isRandom: boolean;
  onToggleRandom: () => void;
  currentIndex: number;
  totalInPool: number;
  cycleCount: number;
  soundEnabled: boolean;
  onToggleMastered?: () => void;
  onStartChallenge: () => void;
}

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    badge: string;
    dot: string;
    lightBg: string;
  }
> = {
  Easy: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
    lightBg: 'from-emerald-500/5 to-transparent',
  },
  Medium: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60',
    dot: 'bg-blue-500',
    lightBg: 'from-blue-500/5 to-transparent',
  },
  Hard: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    dot: 'bg-amber-500',
    lightBg: 'from-amber-500/5 to-transparent',
  },
  Extreme: {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
    dot: 'bg-rose-500',
    lightBg: 'from-rose-500/5 to-transparent',
  },
};

export const TwisterCard: React.FC<TwisterCardProps> = ({
  twister,
  isFavorite,
  isCompleted,
  isSeen,
  onToggleFavorite,
  onNext,
  onPrev,
  isRandom,
  onToggleRandom,
  currentIndex,
  totalInPool,
  cycleCount,
  soundEnabled,
  onToggleMastered,
  onStartChallenge,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showTip, setShowTip] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger if horizontal swipe is dominant and above threshold (40px)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> Next
        onNext();
      } else {
        // Swiped Right -> Prev
        onPrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const diffConfig = DIFFICULTY_CONFIG[twister.difficulty] || DIFFICULTY_CONFIG.Medium;

  // Stop TTS speech if twister changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [twister.id]);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(twister.text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    sound.playPop(soundEnabled);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(twister.text);
      sound.playPop(soundEnabled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleShare = async () => {
    sound.playPop(soundEnabled);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Can you say this tongue twister 3 times fast?',
          text: `👅 "${twister.text}"\n\n🎯 Sound Focus: ${twister.soundFocus} | Speed Goal: ${twister.targetSeconds}s`,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / Math.max(1, totalInPool)) * 100));

  return (
    <div id="twister-card-container" className="w-full px-3 sm:px-4">
      {/* Sequence Bar & Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 px-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              #{currentIndex + 1}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              of {totalInPool}
            </span>
            {cycleCount > 1 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800/40">
                Cycle {cycleCount}
              </span>
            )}
          </div>

          <button
            type="button"
            id="order-mode-toggle"
            onClick={onToggleRandom}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              isRandom
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
            }`}
            title={isRandom ? 'Mode: Shuffled' : 'Mode: In Sequence'}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isRandom ? 'Shuffle' : 'Sequential'}</span>
          </button>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Card Stage */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={twister.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-gradient-to-b ${diffConfig.lightBg}`}
          >
            {/* Top Badges Row */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                {/* Difficulty */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${diffConfig.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`} />
                  {twister.difficulty}
                </span>

                {/* Sound Focus */}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                  {twister.soundFocus}
                </span>
              </div>

              {/* Status Badge */}
              <div>
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Mastered</span>
                  </span>
                ) : isSeen ? (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                    Practiced
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Tongue Twister Center Display */}
            <div className="my-4 sm:my-6 min-h-[90px] sm:min-h-[110px] flex flex-col items-center justify-center">
              <div className="text-center select-text px-2 max-w-xl">
                <p className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-snug tracking-tight">
                  "{twister.text}"
                </p>
              </div>
            </div>

            {/* Coach Tip Accordion */}
            {(twister.tip || twister.funFact) && (
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-slate-800/90 border border-amber-200/80 dark:border-amber-800/60 text-xs space-y-1.5 shadow-2xs">
                      {twister.tip && (
                        <p className="text-slate-800 dark:text-slate-200">
                          <strong className="text-amber-900 dark:text-amber-300 font-bold">
                            Diction Drill Tip:{' '}
                          </strong>
                          {twister.tip}
                        </p>
                      )}
                      {twister.funFact && (
                        <p className="text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-200 font-bold">
                            Trivia:{' '}
                          </strong>
                          {twister.funFact}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Controls Section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
              {/* Prominent Start Challenge Button */}
              <button
                id="start-challenge-mode-btn"
                type="button"
                onClick={onStartChallenge}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-display font-black text-xs sm:text-sm tracking-wide shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer select-none group"
              >
                <Zap className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                <span>Start Challenge • Say 3× Fast</span>
              </button>

              {/* Utility Row: Listen TTS, Favorite, Tip, Copy */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Pronounce / Listen TTS */}
                  <button
                    id="twister-audio-btn"
                    type="button"
                    onClick={handleSpeak}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 ${
                      isSpeaking
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs shadow-amber-500/30 animate-pulse'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-amber-300'
                    }`}
                    title={isSpeaking ? 'Stop audio' : 'Listen to pronunciation'}
                    aria-label="Listen Pronunciation"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  {/* Favorite */}
                  <button
                    id="twister-favorite-btn"
                    type="button"
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
                      isFavorite
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 border-slate-200/80 dark:border-slate-700'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label="Toggle Favorite"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Copy */}
                  <button
                    id="twister-copy-btn"
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                    title="Copy twister text"
                    aria-label="Copy text"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Vocal Tip Toggle */}
                {(twister.tip || twister.funFact) && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop(soundEnabled);
                      setShowTip(!showTip);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 transition-colors cursor-pointer bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showTip ? 'Hide Tip' : 'Tip'}</span>
                  </button>
                )}
              </div>

              {/* Primary Action & Navigation Row */}
              <div className="flex items-center gap-2 w-full pt-0.5">
                <button
                  id="prev-twister-btn"
                  type="button"
                  onClick={onPrev}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs min-h-[42px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {onToggleMastered && (
                  <button
                    id="twister-mastered-btn"
                    type="button"
                    onClick={onToggleMastered}
                    className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs min-h-[42px] ${
                      isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                    }`}
                    title={isCompleted ? 'Mark as not mastered' : 'Mark as mastered!'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isCompleted ? 'fill-white text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                    <span>{isCompleted ? 'Mastered!' : 'Nailed It!'}</span>
                  </button>
                )}

                <button
                  id="next-twister-btn"
                  type="button"
                  onClick={onNext}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px]"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
