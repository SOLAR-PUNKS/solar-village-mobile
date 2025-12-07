import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Region } from 'react-native-maps';
import { Colors } from '../theme';
import { calculateDistance } from '../components/Map';
import { isLocationOpen, formatNextOpenTime } from '../utils/businessHours';
import { TransformedLocation } from '../utils/api';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MAX_LOCATION_DISTANCE_MILES } from '../utils/config';

const handleLocationPress = (
  latitude: number,
  longitude: number,
  mapRef: any,
  locationKey: string,
  onShowCallout: (key: string) => void,
  setSelectedLocationKey: (key: string | null) => void,
) => {
  if (!mapRef.current) return;

  const latitudeDelta = 0.01;
  const longitudeDelta = 0.01;
  
  const latitudeShift = latitudeDelta * 0.35;
  const adjustedLatitude = latitude - latitudeShift;

  const zoomedRegion: Region = {
    latitude: adjustedLatitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };

  mapRef.current.animateToRegion(zoomedRegion, 500);
  
  // Set selected location
  setSelectedLocationKey(locationKey);
  
  // Show the callout after a slight delay to ensure the map animation is complete
  setTimeout(() => {
    onShowCallout(locationKey);
  }, 500);
};

type Props = {
  mapRef: any;
  onShowCallout: (locationKey: string) => void;
  currentRegion: Region;
  locations: TransformedLocation[];
  isLoadingLocations: boolean;
  error?: string | null;
  onCollapse?: () => void;
  collapsedRef?: React.RefObject<(() => void) | null>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 80; // Height when collapsed (just header)
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.6; // 60% of screen height when expanded

const LocationList = ({mapRef, onShowCallout, currentRegion, locations, isLoadingLocations, error, collapsedRef}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  // Expose collapse function via ref if provided
  useEffect(() => {
    if (collapsedRef) {
      collapsedRef.current = () => {
        if (isExpanded) {
          setIsExpanded(false);
        }
      };
    }
    return () => {
      if (collapsedRef) {
        collapsedRef.current = null;
      }
    };
  }, [isExpanded, collapsedRef]);

  // Sort locations by distance to current region
  const sortedLocations = [...locations].sort((a, b) => {
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

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const locationCount = sortedLocations.length;

  return (
    <Animated.View 
      style={[
        styles.locationsListSection,
        {
          height: slideAnim,
        }
      ]}
    >
      {/* Drag Handle / Header */}
      <TouchableOpacity 
        style={styles.dragHandle}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.locationsListTitle}>Nearby Locations ({locationCount})</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-down' : 'chevron-up'} 
            size={24} 
            color={Colors.primary} 
          />
        </View>
      </TouchableOpacity>

      {/* Content Area */}
      {isExpanded && (
        <View style={styles.contentArea}>
          {isLoadingLocations ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading locations...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : sortedLocations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations found within {MAX_LOCATION_DISTANCE_MILES} miles</Text>
            </View>
          ) : (
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
                const isSelected = selectedLocationKey === location.key;
                const hoursText = formatNextOpenTime(location.hours);

                return (
                  <TouchableOpacity 
                    key={location.key} 
                    style={[
                      styles.locationCard,
                      isSelected && styles.locationCardSelected,
                      !isOpen && styles.locationCardClosed
                    ]}
                    onPress={() => handleLocationPress(
                      location.coordinates.latitude,
                      location.coordinates.longitude,
                      mapRef,
                      location.key,
                      onShowCallout,
                      setSelectedLocationKey,
                    )}
                    activeOpacity={0.7}
                  >
                    <View style={styles.locationCardHeader}>
                      <View style={styles.locationTitleContainer}>
                        <Text style={styles.locationTitle}>{location.title}</Text>
                      </View>
                      <Text style={styles.locationDistance}>{distanceText}</Text>
                    </View>
                    <View style={styles.locationCardContent}>
                      <Text style={styles.locationHours}>{location.notes}</Text>
                      {/* <Text style={styles.locationHours}>{hoursText}</Text>
                      {status && (
                        <Text
                          style={[
                            styles.locationStatus,
                            isOpen ? styles.statusOpen : styles.statusClosed,
                          ]}
                        >
                          {status}
                        </Text>
                      )} */}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </Animated.View>
  );
};

export default LocationList;

const styles = StyleSheet.create({
  locationsListSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    overflow: 'hidden',
  },
  dragHandle: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationsListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  locationCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationCardSelected: {
    backgroundColor: '#f0f7ed',
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locationCardClosed: {
    borderLeftColor: '#f44336',
  },
  locationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  selectedIcon: {
    marginLeft: 6,
  },
  locationDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a7c59',
    marginLeft: 8,
  },
  locationCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  locationHours: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    fontWeight: '500',
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
    backgroundColor: '#f44336',
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
});