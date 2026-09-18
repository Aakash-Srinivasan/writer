import { AntDesign, Foundation } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFont } from '~/app/_layout';
import { useTheme } from '~/context/ThemeContext';

// A compact, content-sized chip (not a full-width bar) - sitting alone on
// one side reads much better than a lone icon stretched across empty space.
function DraftsChip({
  label,
  isFocused,
  onPress,
  isLight,
  font,
}: {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  isLight: boolean;
  font: string;
}) {
  const activeText = isLight ? '#2563EB' : '#60A5FA';
  const inactiveText = isLight ? '#6B7280' : '#9CA3AF';

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 28,
        backgroundColor: isLight ? '#FFFFFF' : '#111827',
        borderWidth: 1,
        borderColor: isLight ? '#E5E7EB' : '#374151',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isLight ? 0.08 : 0.3,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <Foundation name="clipboard-notes" size={18} color={isFocused ? activeText : inactiveText} />
      <Text
        style={{
          fontFamily: `${font}-SemiBold`,
          fontSize: 14,
          color: isFocused ? activeText : inactiveText,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// The "Add" tab is its own independent floating FAB in the classic
// bottom-right position, instead of being squeezed into the same bar as
// Drafts - it's an action (write a new draft), not really a "screen you're on".
function AddFabButton({ onPress, isLight }: { onPress: () => void; isLight: boolean }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10 });
      }}
    >
      <Animated.View
        style={[
          {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isLight ? '#2563EB' : '#3B82F6',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        <AntDesign name="plus" size={26} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

// A minimal local shape instead of importing `BottomTabBarProps` - expo-router
// vendors its own copy of react-navigation's bottom-tabs internally rather
// than depending on the separate `@react-navigation/bottom-tabs` package, so
// there's no stable public type import path for it. Only the fields this
// component actually reads are declared.
type TabBarProps = {
  state: { routes: { key: string; name: string }[]; index: number };
  descriptors: Record<string, { options: { title?: string } }>;
  // Loosely typed on purpose: react-navigation's real navigation helpers are
  // a generic keyed on its full event map, which isn't worth reproducing
  // here just to call `emit` with a literal 'tabPress' event and `navigate`
  // with a route name.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
};

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();
  const insets = useSafeAreaInsets();

  const makePress = (routeKey: string, routeName: string, isFocused: boolean) => () => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 12,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = makePress(route.key, route.name, isFocused);

        if (route.name === 'create') {
          return <AddFabButton key={route.key} onPress={onPress} isLight={isLight} />;
        }

        return (
          <DraftsChip
            key={route.key}
            label={typeof options.title === 'string' ? options.title : route.name}
            isFocused={isFocused}
            onPress={onPress}
            isLight={isLight}
            font={font}
          />
        );
      })}
    </View>
  );
}
