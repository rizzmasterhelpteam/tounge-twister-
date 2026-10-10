import React from 'react';
import { X, Play, RotateCcw, Volume2, Flame, Trophy, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TongueTwister, UserStats } from '../types';
import { sound } from '../utils/sound';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  twister: TongueTwister;
  stats: UserStats;
  onSuccess: (secondsTaken: number) => void;
  onFail: (secondsTaken: number) => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  twister,
  stats,
  onSuccess,
  onFail,
}) => {
  const [repsDone, setRepsDone] = React.useState<number>(0);
  const [timerSeconds, setTimerSeconds] = React.useState<number>(twister.targetSeconds);
  const [elapsedSeconds, setElapsedSeconds] = React.useState<number>(0);
  const [timerState, setTimerState] = React.useState<'ready' | 'running' | 'completed' | 'failed'>('ready');
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const [justCelebrated, setJustCelebrated] = React.useState<boolean>(false);

  // Reset state whenever modal opens or twister changes
  React.useEffect(() => {
    if (isOpen) {
      setRepsDone(0);
      setTimerSeconds(twister.targetSeconds);
      setElapsedSeconds(0);
      setTimerState('ready');
      setJustCelebrated(false);
      sound.playPop(stats.soundEnabled);
    }
  }, [isOpen, twister]);

  // Timer interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && timerState === 'running') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Target time reached (can still continue or finish)
            sound.playCountdownBeep(true, stats.soundEnabled);
            return 0;
          }
          if (prev <= 4) {
            sound.playCountdownBeep(false, stats.soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timerState, stats.soundEnabled]);

  if (!isOpen) return null;

  // Handle Speech Synthesis
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(twister.text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleStartTimer = () => {
    setTimerState('running');
    sound.playTick(1, stats.soundEnabled);
    sound.vibrate(30, stats.hapticsEnabled);
  };

  const handleTapRep = (repIndex: number) => {
    if (timerState === 'ready') {
      setTimerState('running');
    }
    sound.vibrate(25, stats.hapticsEnabled);
    sound.playTick(repIndex + 1, stats.soundEnabled);
    const nextReps = Math.min(3, repIndex + 1);
    setRepsDone(nextReps);

    if (nextReps === 3) {
      sound.playBoing(stats.soundEnabled);
    }
  };

  const handleSuccess = () => {
    setTimerState('completed');
    setJustCelebrated(true);
    sound.playSuccess(stats.soundEnabled);
    sound.vibrate([60, 60, 200], stats.hapticsEnabled);

    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    const finalTime = Math.max(1, elapsedSeconds);
    onSuccess(finalTime);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleFail = () => {
    setTimerState('failed');
    sound.playFail(stats.soundEnabled);
    sound.vibrate(80, stats.hapticsEnabled);
    onFail(Math.max(1, elapsedSeconds));
  };

  const handleRetry = () => {
    setRepsDone(0);
    setTimerSeconds(twister.targetSeconds);
    setElapsedSeconds(0);
    setTimerState('running');
    setJustCelebrated(false);
    sound.playPop(stats.soundEnabled);
  };

  const comboCount = stats.comboStreak || 0;

  return (
    <div
      id="challenge-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] relative animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-3.5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-display font-black tracking-tight leading-none">
                Speed Challenge
              </h3>
              <p className="text-[10px] text-amber-100 font-medium mt-0.5">
                Target: {twister.targetSeconds}s • {twister.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comboCount > 0 && (
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-black animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>{comboCount}× Combo</span>
              </div>
            )}
            <button
              id="close-challenge-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
              aria-label="Close Challenge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-between space-y-4 overflow-y-auto">
          {/* Target Instruction Pill */}
          <div className="w-full text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Say It 3× Fast!</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear articulation without slurring or tripping your tongue
            </p>
          </div>

          {/* Large Countdown / Timer Dial */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Outer circular background */}
              <div
                className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${
                  timerState === 'running'
                    ? timerSeconds === 0
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 animate-pulse'
                      : 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                    : timerState === 'completed'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                    : timerState === 'failed'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              />

              <div className="relative text-center z-10">
                <span
                  className={`text-3xl sm:text-4xl font-display font-black tracking-tight ${
                    timerSeconds === 0
                      ? 'text-orange-600 dark:text-orange-400'
                      : timerState === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {timerState === 'ready' ? twister.targetSeconds : elapsedSeconds}s
                </span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  {timerState === 'ready'
                    ? 'Target'
                    : timerState === 'running'
                    ? 'Elapsed'
                    : timerState === 'completed'
                    ? 'Nailed!'
                    : 'Stumbled'}
                </span>
              </div>
            </div>

            {timerState === 'ready' && (
              <button
                type="button"
                onClick={handleStartTimer}
                className="mt-3 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Timer</span>
              </button>
            )}
          </div>

          {/* Tongue Twister Card Highlight */}
          <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 text-center relative shadow-xs">
            <p className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white leading-relaxed">
              "{twister.text}"
            </p>

            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Hear Articulation"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-amber-500 animate-pulse' : ''}`} />
                <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
              </button>
              <span className="text-[11px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60">
                Focus: {twister.soundFocus}
              </span>
            </div>
          </div>

          {/* Interactive 3 Reps Progress Tracker */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
              <span>Repetition Counter:</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                {repsDone} / 3 Completed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => {
                const isChecked = repsDone > idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTapRep(idx)}
                    className={`py-2.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs scale-102'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {isChecked ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>Rep {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Result Actions */}
          <div className="w-full pt-2">
            {timerState === 'failed' ? (
              <div className="space-y-2 animate-in fade-in">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center text-xs font-semibold text-rose-700 dark:text-rose-300">
                  👅 Flubbed your tongue? Shake it off and try again!
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again Now</span>
                </button>
              </div>
            ) : justCelebrated ? (
              <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-center font-bold text-sm flex items-center justify-center gap-2 shadow-lg animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5" />
                <span>Mastered! Streak Extended!</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="challenge-fail-btn"
                  type="button"
                  onClick={handleFail}
                  className="py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Tongue Tied 😵</span>
                </button>

                <button
                  id="challenge-success-btn"
                  type="button"
                  onClick={handleSuccess}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Nailed It! 🥳</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
