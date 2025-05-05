import { Tabs } from 'expo-router';
import { useFont } from '~/app/_layout';
import { TabBarIcon } from '~/components/TabBarIcon';
import { useTheme } from '~/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();
    console.log('Font:', font);
  
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
          tabBarLabelStyle: {
            fontFamily: `${font}-Regular`,
            fontSize: 12,
          },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          tabBarLabelStyle: {
            fontFamily: `${font}-Regular`,
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}
