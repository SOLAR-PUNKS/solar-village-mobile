import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
// import ChatScreen from './screens/ChatScreen';
import { AppProvider } from './utils/AppContext';

import { Colors } from './theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
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

            // Wrap Home icon in a special container for elevation
            // if (route.name === 'Home') {
            //   return (
            //     <View style={styles.homeIconContainer}>
            //       <Ionicons name={iconName} size={iconSize} color={color} />
            //     </View>
            //   );
            // }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.inactive,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
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
      </NavigationContainer>
    </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  homeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});

