// context/ThemeContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark';
export type ThemePreference = ThemeType | 'system';

const THEME_KEY = 'appTheme';

type ThemeContextValue = {
  theme: ThemeType; // resolved light/dark, for existing isLight-style checks
  preference: ThemePreference; // what the user actually picked (may be 'system')
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void; // kept for the existing header icon - flips light/dark explicitly
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>('light');
  // nativewind's own colorScheme is the single source of truth for what
  // actually renders - `setColorScheme('system')` is natively supported and
  // keeps `colorScheme` in sync with OS appearance changes from then on.
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    (async () => {
      try {
        const saved = (await AsyncStorage.getItem(THEME_KEY)) as ThemePreference | null;
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
          setColorScheme(saved);
        }
      } catch (error) {
        console.warn('Failed to load saved theme, falling back to light theme.', error);
      }
    })();
  }, []);

  const setThemePreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
    setColorScheme(pref);
    AsyncStorage.setItem(THEME_KEY, pref).catch((error) => {
      console.warn('Failed to persist theme preference.', error);
    });
  };

  const toggleTheme = () => {
    setThemePreference(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const theme: ThemeType = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, preference, setThemePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
