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

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useTheme } from '../../context/ThemeContext';
import { useFont } from '../_layout'; // adjust path if needed
import { View, Text, Pressable } from 'react-native';

const DrawerLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { font, setFont } = useFont();

  const isLight = theme === 'light';
  const isLemon = font === 'Lemon-Regular';

  const drawerBackground = isLight ? '#FFFFFF' : '#111827';
  const activeTint = isLight ? '#2563EB' : '#60A5FA';
  const inactiveTint = isLight ? '#4B5563' : '#D1D5DB';
  const headerBg = isLight ? '#F9FAFB' : '#1F2937';

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1 }}
        className="bg-white dark:bg-gray-900"
      >
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
            className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
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
          headerTitleStyle: {
            fontFamily: `${font}-SemiBold`,
            fontSize: 20,
          }
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
