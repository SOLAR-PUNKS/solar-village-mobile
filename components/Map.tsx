import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useRef } from 'react';
import haversine from 'haversine';

import { Colors } from '../theme';

export type LocationAccuracy = 'cached' | 'approximate' | 'precise' | 'error';

type Props = {
  locationAccuracy: LocationAccuracy;
  mapSize: number;
  ref: any;
  region: Region;
  onMapReady?: (markerRefs: Record<string, any>) => void;
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

const FOOD = [
  // {
  //   key: '35.780267339528486, -78.64115920355435',
  //   address: '125 Hillsborough St., Raleigh, NC 27603',
  //   coordinates: {
  //     latitude: 35.78021511592242,
  //     longitude: -78.64119139005999
  //   },
  //   title: 'Wake County Mini Pantry',
  //   description: '',
  // },
  {
    key: '35.779982363949365, -78.64105924588402',
    address: '121 W. Morgan St., Raleigh, NC, 27603',
    coordinates: {
      latitude: 35.779982363949365,
      longitude: -78.64105924588402
    },
    title: `Shepherd's Table Soup Kitchen`,
    description: '',
    hours: {
      monday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      tuesday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      wednesday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      thursday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      friday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
    }
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
    hours: {
      monday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      tuesday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      wednesday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      thursday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      friday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      saturday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      sunday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
    }
  },
  // {
  //   key: '35.77970044919447, -78.63695230724738',
  //   address: '136 E. Morgan St., Raleigh, NC, 27601',
  //   coordinates: {
  //     latitude: 35.77970044919447,
  //     longitude: -78.63695230724738
  //   },
  //   title: `Wake County Mini Pantry`,
  //   description: '',
  // },
  {
    key: '35.77951569339792, -78.61689181704875',
    address: '13 Heath St, Raleigh, NC 27610',
    coordinates: {
      latitude: 35.77951569339792,
      longitude: -78.61689181704875,
    },
    title: `Lincoln Park Community Outreach Center`,
    description: ``,
    hours: {
      tuesday: {
        open: '2:00 PM',
        close: '4:00 PM',
      },
      thursday: {
        open: '2:00 PM',
        close: '4:00 PM',
      },
      saturday: {
        open: '2:00 PM',
        close: '3:00 PM',
      }
    }
  }
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
