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
          overflow: 'hidden',
          marginHorizontal: 10,
          justifyContent:'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 16,
          marginVertical: 10,
          height: 77,
          borderColor: isLight ? '#E5E7EB' : '#374151', // light: gray-200, dark: gray-700
          shadowColor: isLight ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isLight ? 0.1 : 0.2,
          shadowRadius: 6,
          elevation: 5,
          borderWidth: 1,
          position: 'absolute',
          bottom: 38,
          backgroundColor: isLight ? '#FFFFFF' : '#111827',
        },
        tabBarInactiveTintColor: isLight ? '#6B7280' : '#9CA3AF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Drafts',
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
          title: 'Add',
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
