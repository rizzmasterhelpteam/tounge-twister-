import React from 'react';
import { WifiOff, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdMobBannerProps {
  darkMode?: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = () => {
  return (
    <footer
      id="admob-banner-container"
      className="w-full bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200/70 dark:border-slate-800/80 px-3 py-1.5 shrink-0 select-none text-[11px] text-slate-500 dark:text-slate-400 transition-colors"
      aria-label="App Status Bar"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <WifiOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Offline Ready</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline">Use Arrow keys ← → for instant flip</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            AdMob Compliant
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="System Ready" />
        </div>
      </div>
    </footer>
  );
};

interface AdMobInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdMobInterstitial: React.FC<AdMobInterstitialProps> = ({ isOpen, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(3);

  React.useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(3);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const canSkip = secondsRemaining === 0;

  return (
    <div
      id="admob-interstitial-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-white uppercase">
            Test Ad
          </span>

          <div>
            {canSkip ? (
              <button
                id="admob-close-button"
                onClick={onClose}
                className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95"
              >
                Close ✕
              </button>
            ) : (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                Skip in {secondsRemaining}s
              </span>
            )}
          </div>
        </div>

        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm text-xl font-bold">
            👅
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Clear Speech & Articulation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sample interstitial test placement delivered between milestones.
            </p>
          </div>
        </div>

        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Test Placement
          </span>
          {canSkip && (
            <button
              onClick={onClose}
              className="text-slate-800 dark:text-slate-200 font-semibold hover:underline cursor-pointer"
            >
              Continue Practice →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
