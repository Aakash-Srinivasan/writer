// app/(drawer)/_layout.tsx or app/layout.tsx (depending on your structure)

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from '../../context/ThemeContext';
import { Pressable, View } from 'react-native';

const DrawerLayout = () => {
  const { theme, toggleTheme } = useTheme();

  // Define theme colors
  const isLight = theme === 'light';

  const drawerBackground = isLight ? '#FFFFFF' : '#111827'; // white / dark gray
  const activeTint = isLight ? '#2563EB' : '#60A5FA'; // blue shades
  const inactiveTint = isLight ? '#4B5563' : '#D1D5DB'; // gray shades
  const headerBg = isLight ? '#F9FAFB' : '#1F2937';

  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: drawerBackground,
        },
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTintColor: isLight ? '#000' : '#FFF',
        drawerActiveTintColor: activeTint,
        drawerInactiveTintColor: inactiveTint,
        headerRight: () => (
          <Pressable
            onPress={toggleTheme}
            style={{
              marginRight: 15,
              padding: 6,
              borderRadius: 100,
              backgroundColor: isLight ? '#E5E7EB' : '#374151', // bg-gray-200 or bg-gray-700
            }}
          >
            <Ionicons
              name={isLight ? 'moon' : 'sunny'}
              size={22}
              color={isLight ? '#1F2937' : '#FACC15'}
            />
          </Pressable>
        ),
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Welcome',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
