import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

import { Colors } from '../theme';

export type LocationAccuracy = 'cached' | 'approximate' | 'precise' | 'error';

type Props = {
  locationAccuracy: LocationAccuracy;
  mapSize: number;
  ref: any;
  region: Region;
};

// Default region (San Francisco) - used as fallback
export const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Map = ({locationAccuracy, mapSize, ref, region}: Props) => {
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
  >
    {/* TODO: Remove when we actually implement the BE */}
    <Marker
      key="reportId"
      coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
      title="Test Pin"
      description="This is a pin for demo purposes. Other details can go in here."
    />
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
