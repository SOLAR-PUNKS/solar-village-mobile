import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
// import ChatScreen from './screens/ChatScreen';
import { AppProvider } from './utils/AppContext';

import { Colors } from './theme';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          let iconSize = size;

          if (route.name === 'Home') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          height: 60 + insets.bottom, // Add safe area inset to tab bar height
          paddingBottom: insets.bottom, // Add padding for safe area
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
      })}
    >
      {/* <Tab.Screen name="Chat" component={ChatScreen} /> */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  // Configure status bar style based on theme
  const statusBarStyle = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <SafeAreaProvider>
      <StatusBar
        style={statusBarStyle}
        translucent={true}
      />
      <AppProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}



