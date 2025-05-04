// // context/ThemeContext.tsx

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { lightTheme, darkTheme } from '../theme/themes';

// type ThemeMode = 'light' | 'dark' | 'system';

// const ThemeContext = createContext<any>(null);

// export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const systemColorScheme = useColorScheme();
//   const [themeMode, setThemeMode] = useState<ThemeMode>('light');
//   const [theme, setTheme] = useState(lightTheme);

//   const applyTheme = (mode: ThemeMode, systemScheme: ColorSchemeName) => {
//     const resolved = mode === 'system' ? systemScheme : mode;
//     setTheme(resolved === 'dark' ? darkTheme : lightTheme);
//   };

//   useEffect(() => {
//     (async () => {
//       const saved = await AsyncStorage.getItem('themeMode');
//       const mode = (saved as ThemeMode) || 'light';
//       setThemeMode(mode);
//       applyTheme(mode, systemColorScheme);
//     })();
//   }, [systemColorScheme]);

//   const changeTheme = async (mode: ThemeMode) => {
//     setThemeMode(mode);
//     await AsyncStorage.setItem('themeMode', mode);
//     applyTheme(mode, Appearance.getColorScheme());
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // ✅ THIS is the function you’re trying to use!
// export const useTheme = () => useContext(ThemeContext);

// context/ThemeContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type ThemeType = 'light' | 'dark';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    (async () => {
      const savedTheme = (await AsyncStorage.getItem('appTheme')) as ThemeType;
      if (savedTheme) {
        setTheme(savedTheme);
        setColorScheme(savedTheme);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeType = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setColorScheme(newTheme);
    await AsyncStorage.setItem('appTheme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
