import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import { useRef } from 'react';
import haversine from 'haversine';

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

const Map = ({locationAccuracy, ref, region, onMapReady, locations, isLoadingLocations, onPress}: Props) => {
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
        title={location.title}
        description={location.address}
      />
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
    width: 200,
  },
  callout: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 13,
    color: '#666',
  },
});

export default Map;
