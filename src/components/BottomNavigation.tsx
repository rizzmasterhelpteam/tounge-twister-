import React from 'react';
import { Home, Sparkles, Heart, BarChart3 } from 'lucide-react';
import { AppTab } from '../types';
import { sound } from '../utils/sound';

interface BottomNavigationProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  favoritesCount: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  soundEnabled,
  hapticsEnabled,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  const handleTabClick = (tabId: AppTab) => {
    if (tabId !== currentTab) {
      sound.playPop(soundEnabled);
      sound.vibrate(20, hapticsEnabled);
      onSelectTab(tabId);
    }
  };

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shrink-0 z-40 select-none safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 px-3 py-1.5 sm:py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {tab.id === 'favorites' && favoritesCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-xs ${
                      isActive
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
