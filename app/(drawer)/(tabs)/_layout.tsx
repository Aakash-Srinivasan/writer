import { Tabs } from 'expo-router';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useTheme } from '~/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isLight ? '#000000' : '#FFFFFF',
        tabBarStyle: {
          backgroundColor: isLight ? '#FFFFFF' : '#111827',
        },
        tabBarInactiveTintColor: isLight ? '#6B7280' : '#9CA3AF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <TabBarIcon name="clipboard-notes" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
    </Tabs>
  );
}
