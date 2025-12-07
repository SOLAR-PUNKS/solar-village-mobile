import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import { useRef } from 'react';
import haversine from 'haversine';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../theme';
import { TransformedLocation } from '../utils/api';

export type LocationAccuracy = 'cached' | 'approximate' | 'precise' | 'error';

type Props = {
  locationAccuracy: LocationAccuracy;
  ref: any;
  region: Region;
  onMapReady?: (markerRefs: Record<string, any>) => void;
  locations: TransformedLocation[];
  isLoadingLocations?: boolean;
  onPress?: () => void;
  useSimpleCallouts?: boolean; // Use native callouts instead of custom ones
  useNativeAndroidCallouts?: boolean; // Force native callouts on Android specifically
};

// Calculate distance between two coordinates using haversine library (in kilometers)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  return haversine(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 },
    { unit: 'mile' }
  );
};

// Default region (San Francisco) - used as fallback
export const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Get today's hours formatted for display
const getTodayHours = (hours?: Record<string, { open: string; close: string } | string>): string => {
  if (!hours) return 'Hours not available';
  
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayHours = hours[dayName];
  
  if (!todayHours) return 'Closed today';
  
  if (typeof todayHours === 'string') {
    const formatted = todayHours.charAt(0).toUpperCase() + todayHours.slice(1);
    return formatted === 'Closed' ? 'Closed today' : formatted;
  }
  
  const { open, close } = todayHours;
  if (open === close) return 'Open 24 hours';
  
  return `Today: ${open} - ${close}`;
};

// Open navigation app with the given coordinates
const openNavigation = (latitude: number, longitude: number, title: string) => {
  const destination = `${latitude},${longitude}`;
  const label = encodeURIComponent(title);
  
  let url: string;
  
  if (Platform.OS === 'ios') {
    // iOS - opens in Apple Maps
    url = `maps:${destination}?q=${label}`;
  } else {
    // Android - opens in Google Maps
    url = `geo:${destination}?q=${destination}(${label})`;
  }
  
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url).catch((err) => {
        console.error('Failed to open navigation app:', err);
        // Fallback to Google Maps web if native app fails
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        Linking.openURL(webUrl);
      });
    } else {
      // Fallback to Google Maps web
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      Linking.openURL(webUrl).catch((err) => {
        console.error('Failed to open web navigation:', err);
      });
    }
  }).catch((err) => {
    console.error('Failed to check URL support:', err);
  });
};

const Map = ({locationAccuracy, ref, region, onMapReady, locations, isLoadingLocations, onPress, useSimpleCallouts = false, useNativeAndroidCallouts = false}: Props) => {
  const markerRefs = useRef<Record<string, any>>({});

  const handleMapReady = () => {
    if (onMapReady) {
      onMapReady(markerRefs.current);
    }
  };

  // Map renders immediately with default/cached region
  return <MapView
    ref={ref}
    style={styles.map}
    initialRegion={region}
    showsUserLocation={locationAccuracy !== 'error'}
    showsMyLocationButton={locationAccuracy !== 'error'}
    showsPointsOfInterest={false}
    showsBuildings={false}
    loadingEnabled={true}
    loadingIndicatorColor={Colors.primary}
    loadingBackgroundColor="#f5f5f5"
    onMapReady={handleMapReady}
    onPress={onPress}
  >
    {!isLoadingLocations && locations.map((location) => (
      <Marker
        ref={(marker) => {
          if (marker) {
            markerRefs.current[location.key] = marker;
          }
        }}
        key={location.key}
        coordinate={{
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
        }}
        tracksViewChanges={false}
        title={(useSimpleCallouts || useNativeAndroidCallouts) ? location.title : undefined}
        description={(useSimpleCallouts || useNativeAndroidCallouts) ? location.address : undefined}
        onCalloutPress={(useSimpleCallouts || useNativeAndroidCallouts) ? () => {
          Alert.alert(
            location.title,
            `${location.address}\n\n${location.notes}\n\nWould you like directions to this location?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Get Directions', 
                onPress: () => openNavigation(
                  location.coordinates.latitude,
                  location.coordinates.longitude,
                  location.title
                )
              }
            ],
            { cancelable: true }
          );
        } : undefined}
      >
        
        {!useSimpleCallouts && Platform.OS === 'ios' && (
          // iOS: Rich interactive callout with TouchableOpacity
          <Callout style={styles.calloutContainer}>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{location.title}</Text>
              <Text style={styles.calloutAddress}>{location.address}</Text>
              <Text style={styles.calloutHours}>{getTodayHours(location.hours)}</Text>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => openNavigation(
                  location.coordinates.latitude,
                  location.coordinates.longitude,
                  location.title
                )}
              >
                <Ionicons name="navigate" size={20} color={Colors.primary} />
                <Text style={styles.navigationText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </Callout>
        )}
        
        {!useSimpleCallouts && !useNativeAndroidCallouts && Platform.OS === 'android' && (
          // Android: Custom callout with proper height handling
          <Callout 
            style={styles.androidCalloutContainer}
            onPress={() => {
              Alert.alert(
                location.title,
                `${location.address}\n\n${location.notes}\n\nWould you like directions to this location?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Get Directions', 
                    onPress: () => openNavigation(
                      location.coordinates.latitude,
                      location.coordinates.longitude,
                      location.title
                    )
                  }
                ],
                { cancelable: true }
              );
            }}
          >
            <View style={styles.androidCallout}>
              <Text style={styles.androidCalloutTitle} numberOfLines={1}>
                {location.title}
              </Text>
              <Text style={styles.androidCalloutAddress} numberOfLines={2}>
                {location.address}
              </Text>
              <Text style={styles.androidCalloutHours} numberOfLines={1}>
                {getTodayHours(location.hours)}
              </Text>
              <Text style={styles.androidCalloutTap}>Tap for directions</Text>
            </View>
          </Callout>
        )}
      </Marker>
    ))}
    
  </MapView>
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    width: 250,
    maxWidth: 250,
  },
  callout: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 120,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    lineHeight: 20,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  calloutHours: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 18,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 4,
  },
  navigationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
  },
  // Android-specific styles with proper height management
  androidCalloutContainer: {
    width: 200,
    height: 80, // Fixed height to prevent cutoff
  },
  androidCallout: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    height: 80, // Match container height
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  androidCalloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    lineHeight: 16,
  },
  androidCalloutAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 14,
  },
  androidCalloutHours: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    lineHeight: 13,
  },
  androidCalloutTap: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Map;
