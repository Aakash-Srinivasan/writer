import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { themeMode, changeTheme, theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {['light', 'dark', 'system'].map((mode) => (
        <TouchableOpacity
          key={mode}
          onPress={() => changeTheme(mode as any)}
          style={{
            backgroundColor: theme.primary,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff' }}>{mode.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
