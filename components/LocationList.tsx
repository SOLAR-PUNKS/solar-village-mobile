import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Region } from 'react-native-maps';
import { Colors } from '../theme';
import { LOCATIONS, calculateDistance } from '../components/Map';
import { isLocationOpen } from '../utils/businessHours';

const handleLocationPress = (
  latitude: number,
  longitude: number,
  mapRef: any,
  locationKey: string,
  onShowCallout: (key: string) => void,
) => {
  if (!mapRef.current) return;

  const zoomedRegion: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  mapRef.current.animateToRegion(zoomedRegion, 500);
  
  // Show the callout after a slight delay to ensure the map animation is complete
  setTimeout(() => {
    onShowCallout(locationKey);
  }, 500);
};

type Props = {
  mapRef: any;
  onShowCallout: (locationKey: string) => void;
  currentRegion: Region;
}

const LocationList = ({mapRef, onShowCallout, currentRegion}: Props) => {
  // Sort locations by distance to current region
  const sortedLocations = [...LOCATIONS].sort((a, b) => {
    const distanceA = calculateDistance(
      currentRegion.latitude,
      currentRegion.longitude,
      a.coordinates.latitude,
      a.coordinates.longitude
    );
    const distanceB = calculateDistance(
      currentRegion.latitude,
      currentRegion.longitude,
      b.coordinates.latitude,
      b.coordinates.longitude
    );
    return distanceA - distanceB;
  });

  return (
    <View style={styles.locationsListSection}>
      <Text style={styles.locationsListTitle}>All Locations</Text>
      <ScrollView 
        style={styles.locationsList}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
      >
        {sortedLocations.map((location) => {
          const distance = calculateDistance(
            currentRegion.latitude,
            currentRegion.longitude,
            location.coordinates.latitude,
            location.coordinates.longitude
          );
          const distanceText = `${distance.toFixed(1)}mi`;
          const { isOpen, status } = isLocationOpen(location.hours);

          return (
            <TouchableOpacity 
              key={location.key} 
              style={styles.locationCard}
              onPress={() => handleLocationPress(
                location.coordinates.latitude,
                location.coordinates.longitude,
                mapRef,
                location.key,
                onShowCallout,
              )}
              activeOpacity={0.7}
            >
              <View style={styles.locationCardHeader}>
                <Text style={styles.locationTitle}>{location.title}</Text>
                <Text style={styles.locationDistance}>{distanceText}</Text>
              </View>
              <View style={styles.locationCardSubHeader}>
                <Text style={styles.locationAddress}>{location.address}</Text>
                {status && (
                  <Text
                    style={[
                      styles.locationStatus,
                      isOpen ? styles.statusOpen : styles.statusClosed,
                    ]}
                  >
                    {status}
                  </Text>
                )}
              </View>
              {location.description && (
                <Text style={styles.locationDescription}>{location.description}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default LocationList;

const styles = StyleSheet.create({
    locationsListSection: {
    width: '100%',
    maxHeight: 300,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationsListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  locationsList: {
    maxHeight: 250,
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  locationDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
    marginLeft: 8,
  },
  locationCardSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  locationStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusOpen: {
    backgroundColor: Colors.success,
    color: '#fff',
  },
  statusClosed: {
    backgroundColor: Colors.error,
    color: '#fff',
  },
  locationDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});