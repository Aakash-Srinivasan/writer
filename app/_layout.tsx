import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '~/context/ThemeContext';

// FontContext
const FontContext = createContext({
  font: 'Nunito-Regular',
  setFont: (font: string) => { },
});

export const useFont = () => useContext(FontContext);

// FontProvider
function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState('Nunito-Regular');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const setFont = async (newFont: string) => {
    setFontState(newFont);
    await AsyncStorage.setItem('selectedFont', newFont);
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        // Nunito
        'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
        'Nunito-Medium': require('../assets/fonts/Nunito-Medium.ttf'),
        'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
        'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
        //PlayfairDisplay
        'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
        'PlayfairDisplay-SemiBold': require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
        'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),


        // Poppins
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),

        // Lora
        'Lora-Regular': require('../assets/fonts/Lora-Regular.ttf'),
        'Lora-Medium': require('../assets/fonts/Lora-Medium.ttf'),
        'Lora-SemiBold': require('../assets/fonts/Lora-SemiBold.ttf'),
        'Lora-Bold': require('../assets/fonts/Lora-Bold.ttf'),
      });

      const storedFont = await AsyncStorage.getItem('selectedFont');
      if (storedFont) {
        setFontState(storedFont);
      }

      setFontsLoaded(true);
    };

    loadFonts();
  }, []);


  if (!fontsLoaded) {
    return <View><Text>Loading fonts...</Text></View>;
  }

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

// Settings
export const unstable_settings = {
  initialRouteName: '(drawer)',
};

// ThemedRoot uses both theme and font
function ThemedRoot() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// RootLayout with Theme and Font providers
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FontProvider>
            <ThemedRoot />
          </FontProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
