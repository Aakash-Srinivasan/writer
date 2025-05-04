import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '~/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

// Wrap status bar logic inside a component that uses ThemeContext
function ThemedRoot() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} backgroundColor={theme === 'light' ? 'white' : 'black'} />
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedRoot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
