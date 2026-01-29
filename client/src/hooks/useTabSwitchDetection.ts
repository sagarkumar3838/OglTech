import { useEffect, useRef, useState } from 'react';

interface TabSwitchOptions {
  onTabSwitch: () => void;
  onTabReturn?: () => void;
  maxSwitches?: number;
  resetOnSwitch?: boolean;
  restartOnFirstSwitch?: boolean; // New option to restart test on first switch
}

/**
 * Hook to detect when user switches tabs or minimizes browser
 * Useful for preventing cheating during evaluations
 */
export const useTabSwitchDetection = ({
  onTabSwitch,
  onTabReturn,
  maxSwitches = 3,
  resetOnSwitch = true,
  restartOnFirstSwitch = false
}: TabSwitchOptions) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isTestInvalidated, setIsTestInvalidated] = useState(false);
  const [shouldRestartTest, setShouldRestartTest] = useState(false);
  const lastVisibilityChange = useRef<number>(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      const timeSinceLastChange = now - lastVisibilityChange.current;

      // Ignore rapid changes (< 500ms) to avoid false positives
      if (timeSinceLastChange < 500) {
        return;
      }

      lastVisibilityChange.current = now;

      if (document.hidden) {
        // Tab switched away or minimized
        setIsTabActive(false);
        
        const newCount = switchCount + 1;
        setSwitchCount(newCount);

        console.warn(`⚠️ Tab switch detected! Count: ${newCount}/${maxSwitches}`);
        
        // If restartOnFirstSwitch is enabled, restart test on first switch
        if (restartOnFirstSwitch && newCount === 1) {
          setShouldRestartTest(true);
          console.error('❌ Test will restart with different questions due to tab switch!');
        } else if (newCount >= maxSwitches && resetOnSwitch) {
          setIsTestInvalidated(true);
          console.error('❌ Test invalidated due to too many tab switches!');
        }

        onTabSwitch();
      } else {
        // Tab returned to focus
        setIsTabActive(true);
        onTabReturn?.();
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also listen for blur/focus events (backup detection)
    const handleBlur = () => {
      if (!document.hidden) {
        // Window lost focus but tab is still visible
        console.warn('⚠️ Window lost focus');
      }
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [switchCount, maxSwitches, resetOnSwitch, restartOnFirstSwitch, onTabSwitch, onTabReturn]);

  return {
    switchCount,
    isTabActive,
    isTestInvalidated,
    shouldRestartTest,
    remainingSwitches: Math.max(0, maxSwitches - switchCount)
  };
};

export default useTabSwitchDetection;
