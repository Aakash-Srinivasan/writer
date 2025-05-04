// screens/HomeScreen.tsx

import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-black dark:text-white mb-4">
        Current Theme: {theme}
      </Text>
      <TouchableOpacity
        onPress={toggleTheme}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
