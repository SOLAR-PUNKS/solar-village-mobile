import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Region } from 'react-native-maps';
import { Colors } from '../theme';
import { LOCATIONS } from '../components/Map';

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
}

const LocationList = ({mapRef, onShowCallout}: Props) => (
  <View style={styles.locationsListSection}>
    <Text style={styles.locationsListTitle}>All Locations</Text>
    <ScrollView 
      style={styles.locationsList}
      showsVerticalScrollIndicator={true}
      scrollEventThrottle={16}
    >
      {LOCATIONS.map((location) => (
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
          <Text style={styles.locationTitle}>{location.title}</Text>
          <Text style={styles.locationAddress}>{location.address}</Text>
          {location.description && (
            <Text style={styles.locationDescription}>{location.description}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)

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
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});