import React from 'react';
import { HelpCircle, X, CheckCircle2, ShieldCheck, Sparkles, Target, Mic } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                Speech Coach & Guide
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mastering clear articulation
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

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Why Practice Tongue Twisters?</span>
            </h4>
            <p className="leading-relaxed">
              Tongue twisters condition the tongue, lips, and soft palate through micro-muscle
              gymnastics. Actors, broadcasters, voice coaches, and debaters use them daily to eliminate
              slurring and improve diction.
            </p>
          </div>

          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-amber-500" />
              <span>3 Golden Practice Rules</span>
            </h4>
            <ul className="space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-slate-100">Start in Slow Motion:</strong> Articulate every single phoneme
                  deliberately before accelerating speed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-slate-100">Exaggerate Shapes:</strong> Over-emphasize the "S", "Sh",
                  "R", and "T" sounds to build vocal muscle memory.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-slate-100">Repeat 3x Cleanly:</strong> True mastery means repeating the phrase 3 times
                  in continuous rhythm without stuttering!
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>100% Offline & Private</span>
            </div>
            <p className="leading-relaxed text-amber-950/80 dark:text-amber-200/90">
              This app requires zero internet connection, no accounts, and zero tracking. All twisters,
              drills, streaks, and progress records remain entirely on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
