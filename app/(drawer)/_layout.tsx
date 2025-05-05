// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { Drawer } from 'expo-router/drawer';
// import { useTheme } from '../../context/ThemeContext';
// import { Pressable, View } from 'react-native';
// import { useFont } from '../_layout'; // Adjust path if needed

// const DrawerLayout = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { font, setFont } = useFont();

//   const isLight = theme === 'light';
//   const isLemon = font === 'Lemon-Regular';

//   const drawerBackground = isLight ? '#FFFFFF' : '#111827';
//   const activeTint = isLight ? '#2563EB' : '#60A5FA';
//   const inactiveTint = isLight ? '#4B5563' : '#D1D5DB';
//   const headerBg = isLight ? '#F9FAFB' : '#1F2937';

//   return (
//     <Drawer
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: drawerBackground,
//         },
//         headerStyle: {
//           backgroundColor: headerBg,
//         },
//         headerTintColor: isLight ? '#000' : '#FFF',
//         drawerActiveTintColor: activeTint,
//         drawerInactiveTintColor: inactiveTint,
//         headerRight: () => (
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 10 }}>
//             {/* Theme Toggle */}
//             <Pressable
//               onPress={toggleTheme}
//               style={{
//                 padding: 6,
//                 borderRadius: 100,
//                 backgroundColor: isLight ? '#E5E7EB' : '#374151',
//               }}
//             >
//               <Ionicons
//                 name={isLight ? 'moon' : 'sunny'}
//                 size={22}
//                 color={isLight ? '#1F2937' : '#FACC15'}
//               />
//             </Pressable>

//             {/* Font Switcher */}
//             <Pressable
//               onPress={() => setFont(isLemon ? 'Nunito-Regular' : 'Lemon-Regular')}
//               style={{
//                 padding: 6,
//                 borderRadius: 100,
//                 backgroundColor: isLight ? '#E5E7EB' : '#374151',
//               }}
//             >
//               <MaterialIcons
//                 name="font-download"
//                 size={22}
//                 color={isLight ? '#1F2937' : '#FACC15'}
//               />
//             </Pressable>
//           </View>
//         ),
//       }}
//     >
//       <Drawer.Screen
//         name="(tabs)"
//         options={{
//           headerTitle: 'Welcome',
//           drawerLabel: 'Tabs',
//           drawerIcon: ({ size, color }) => (
//             <MaterialIcons name="border-bottom" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="index"
//         options={{
//           headerTitle: 'Home',
//           drawerLabel: 'Home',
//           drawerIcon: ({ size, color }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Drawer>
//   );
// };

// export default DrawerLayout;

import { Entypo, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useTheme } from '../../context/ThemeContext';
import { useFont } from '../_layout'; // adjust path if needed
import { View, Text, Pressable, Image, Linking, TouchableOpacity, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const DrawerLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { font, setFont } = useFont();

  const isLight = theme === 'light';


  const drawerBackground = isLight ? '#FFFFFF' : '#111827';
  const activeTint = isLight ? '#2563EB' : '#60A5FA';
  const inactiveTint = isLight ? '#4B5563' : '#D1D5DB';
  const headerBg = isLight ? '#F9FAFB' : '#1F2937';
  const handlePress = () => {
    Linking.openURL('https://aakash-srinivasan.netlify.app/');
  };
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isLight ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isLight]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1 }}
        className="bg-white dark:bg-gray-900"
      >
        <Text
          className="text-xl  text-black dark:text-white mb-4"
          style={{ fontFamily: `${font}-Bold` }}
        >
          App Info
        </Text>
        <Image source={require('../../assets/logo.png')} className="w-24 h-24 rounded-full mb-4" />

        <Text className="text-sm text-gray-600 dark:text-gray-300 mb-6" style={{ fontFamily: `${font}-Regular` }}>
          Version: 1.0.0
          {"\n"}Developed by: Aakash Srinivasan
          {"\n"}App name: Drafter App
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          className={`mt-4 px-6 py-3 flex-row justify-center gap-2 rounded-lg bg-blue-500 ${theme === 'light' ? 'shadow-md' : 'shadow-lg'}`}
        >
          <Feather name="external-link" size={24} color="white" />
          <Text className="text-white text-lg font-semibold text-center">Connect with me</Text>
        </TouchableOpacity>

        <View className="border-t border-gray-300 dark:border-gray-700 my-4" />

        <DrawerItemList {...props} />

        <View className="border-t border-gray-300 dark:border-gray-700 my-4" />

        <View className="px-4 ">
          <Text
            className="text-base font-bold mb-2 text-black dark:text-white"
            style={{ fontFamily: `${font}-Regular` }}
          >
            Font
          </Text>

          <View className="flex-row flex-wrap gap-2 ">
            <Pressable
              onPress={() => setFont('Nunito')}
              className={`px-4 py-2 rounded-lg w-[48%] ${font === 'Nunito'
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
              <Text
                className={`text-sm ${font === 'Nunito' ? 'text-white' : 'text-black dark:text-white'
                  }`}
                style={{ fontFamily: `Nunito-Regular` }}
              >
                Nunito
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFont('PlayfairDisplay')}
              className={`px-4 py-2 rounded-lg w-[48%] ${font === 'PlayfairDisplay'
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
              <Text
                className={`text-sm ${font === 'PlayfairDisplay' ? 'text-white' : 'text-black dark:text-white'
                  }`}
                style={{ fontFamily: `PlayfairDisplay-Regular` }}
              >
                PlayfairDisplay
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFont('Poppins')}
              className={`px-4 py-2 rounded-lg w-[48%] ${font === 'Poppins'
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
              <Text
                className={`text-sm ${font === 'Poppins' ? 'text-white' : 'text-black dark:text-white'
                  }`}
                style={{ fontFamily: `Poppins-Regular` }}
              >
                Poppins
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFont('Lora')}
              className={`px-4 py-2 rounded-lg w-[48%] ${font === 'Lora'
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
              <Text
                className={`text-sm ${font === 'Lora' ? 'text-white' : 'text-black dark:text-white'
                  }`}
                style={{ fontFamily: `Lora-Regular` }}
              >
                Lora
              </Text>
            </Pressable>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
      className="mr-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-lg"
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5
          name={isLight ? 'cloud-moon' : 'cloud-sun'}
          size={22}
          color={isLight ? '#1F2937' : '#FACC15'}
        />
      </Animated.View>
    </Pressable>
        ),
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Wellcome Drafter',
          drawerLabel: 'Drafter',
          drawerIcon: ({ size, color }) => (
            <Entypo name="book" size={size} color={color} />
          ),
          headerTitleStyle: {
            fontFamily: `${font}-SemiBold`,
            fontSize: 20,
          }
        }}
      />

    </Drawer>
  );
};

export default DrawerLayout;
