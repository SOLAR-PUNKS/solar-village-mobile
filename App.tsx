import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, AppState } from 'react-native';
import { useEffect, useRef } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';

import { Colors } from './theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Configure Android immersive mode
    if (Platform.OS === 'android') {
      const setupNavigationBar = async () => {
        try {
          // Hide the navigation bar
          await NavigationBar.setVisibilityAsync('hidden');

          // Set behavior to show temporarily when swiping from bottom
          await NavigationBar.setBehaviorAsync('overlay-swipe');

          // Optional: Set navigation bar to be transparent when it appears
          await NavigationBar.setBackgroundColorAsync('#00000000');
        } catch (error) {
          console.log('Error setting up navigation bar:', error);
        }
      };

      setupNavigationBar();

      // Re-hide navigation bar when app becomes active
      const subscription = AppState.addEventListener('change', async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App has come to the foreground, re-hide navigation bar
          try {
            await NavigationBar.setVisibilityAsync('hidden');
          } catch (error) {
            console.log('Error re-hiding navigation bar:', error);
          }
        }
        appState.current = nextAppState;
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  return (
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
              // iconSize = 40; // Larger size for Home icon
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else {
              iconName = 'help-outline';
            }

            // Wrap Home icon in a special container for elevation
            if (route.name === 'Home') {
              return (
                <View style={styles.homeIconContainer}>
                  <Ionicons name={iconName} size={iconSize} color={color} />
                </View>
              );
            }

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
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});

