import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircleHeart } from 'lucide-react';
import { sound } from '../utils/sound';

export type MascotMood = 'idle' | 'cheering' | 'flubbed' | 'streak';

interface TwistyMascotProps {
  mood: MascotMood;
  streakCount: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  speechText?: string;
  onTap?: () => void;
}

const QUIP_LIST = [
  'Relax that jaw & articulate!',
  'Say it 3 times without tripping!',
  'Pop those crisp P’s and B’s!',
  'Careful with tricky S & Sh transitions!',
  'Slow down slightly to speed up!',
  'Crisp consonants win clarity!',
  'Enunciate every single vowel!',
  'Great pace! Keep that rhythm going!',
];

export const TwistyMascot: React.FC<TwistyMascotProps> = ({
  mood,
  streakCount,
  soundEnabled,
  hapticsEnabled,
  speechText,
  onTap,
}) => {
  const [quip, setQuip] = React.useState<string | null>(null);

  const handlePoke = () => {
    sound.playGiggle(soundEnabled);
    sound.vibrate(15, hapticsEnabled);

    const randomQuip = QUIP_LIST[Math.floor(Math.random() * QUIP_LIST.length)];
    setQuip(randomQuip);

    if (onTap) onTap();

    setTimeout(() => {
      setQuip(null);
    }, 3200);
  };

  const isDizzy = mood === 'flubbed';
  const isCheering = mood === 'cheering';
  const currentSpeech = speechText || quip;

  return (
    <div id="twisty-mascot-container" className="flex items-center gap-2 select-none relative">
      {/* Speech Tip Bubble */}
      {currentSpeech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute -top-10 left-10 z-30 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-[11px] px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-600 shrink-0" />
          <span>{currentSpeech}</span>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45" />
        </motion.div>
      )}

      {/* Mascot Avatar Button */}
      <motion.button
        type="button"
        id="twisty-mascot-btn"
        onClick={handlePoke}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        animate={
          isCheering
            ? { y: [-2, -6, -2], rotate: [-5, 5, -5] }
            : isDizzy
            ? { rotate: [-8, 8, -8, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{
          duration: isCheering ? 0.5 : isDizzy ? 0.35 : 3,
          repeat: isCheering ? 3 : isDizzy ? 1 : Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-sm shadow-orange-500/20 cursor-pointer"
        title="Twisty Coach • Tap for speech tips!"
        aria-label="Twisty Coach Tip"
      >
        <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <span className="text-base sm:text-lg leading-none transform select-none">
            {isDizzy ? '😵' : isCheering ? '🥳' : '👅'}
          </span>
          {streakCount >= 2 && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-orange-500 rounded-full ring-1 ring-white dark:ring-slate-900" />
          )}
        </div>
      </motion.button>

      {/* Title & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
            Tongue Twisters
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            Pro
          </span>
        </div>
        <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
          Diction & Articulation Practice
        </p>
      </div>
    </div>
  );
};
