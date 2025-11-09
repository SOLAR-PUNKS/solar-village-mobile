import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useRef } from 'react';

import { Colors } from '../theme';

export type LocationAccuracy = 'cached' | 'approximate' | 'precise' | 'error';

type Props = {
  locationAccuracy: LocationAccuracy;
  mapSize: number;
  ref: any;
  region: Region;
  onMapReady?: (markerRefs: Record<string, any>) => void;
};

// Default region (San Francisco) - used as fallback
export const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const FOOD = [
  {
    key: '35.780267339528486, -78.64115920355435',
    address: '125 Hillsborough St., Raleigh, NC 27603',
    coordinates: {
      latitude: 35.78021511592242,
      longitude: -78.64119139005999
    },
    title: 'Wake County Mini Pantry',
    description: '',
  },
  {
    key: '35.779982363949365, -78.64105924588402',
    address: '121 W. Morgan St., Raleigh, NC, 27603',
    coordinates: {
      latitude: 35.779982363949365,
      longitude: -78.64105924588402
    },
    title: `Shepherd's Table Soup Kitchen`,
    description: '',
  },
  {
    key: '35.778023468882594, -78.63428830355457',
    address: '314 E Hargett St Raleigh NC 27601',
    coordinates: {
      latitude: 35.778023468882594,
      longitude: -78.63428830355457
    },
    title: `Raleigh Rescue Mission`,
    description: '',
  },
  {
    key: '35.77970044919447, -78.63695230724738',
    address: '136 E. Morgan St., Raleigh, NC, 27601',
    coordinates: {
      latitude: 35.77970044919447,
      longitude: -78.63695230724738
    },
    title: `Wake County Mini Pantry`,
    description: '',
  },
];

export const LOCATIONS = FOOD;

const Map = ({locationAccuracy, mapSize, ref, region, onMapReady}: Props) => {
  const markerRefs = useRef<Record<string, any>>({});

  const handleMapReady = () => {
    if (onMapReady) {
      onMapReady(markerRefs.current);
    }
  };

  // Map renders immediately with default/cached region
  return <MapView
    ref={ref}
    style={[styles.map, {width: mapSize, height: mapSize}]}
    initialRegion={region}
    showsUserLocation={locationAccuracy !== 'error'}
    showsMyLocationButton={locationAccuracy !== 'error'}
    loadingEnabled={true}
    loadingIndicatorColor={Colors.primary}
    loadingBackgroundColor="#f5f5f5"
    onMapReady={handleMapReady}
  >
    {/* TODO: Remove when we actually implement the BE */}
    {/* <Marker
      key="reportId"
      coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
      title="Test Pin"
      description="This is a pin for demo purposes. Other details can go in here."
    /> */}
    {FOOD.map((location) => (
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
        title={location.title}
        description={location.address}
      />
    ))}
    
  </MapView>
}

const styles = StyleSheet.create({
  map: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Map;
