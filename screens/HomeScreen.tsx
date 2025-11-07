import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, ReportFormModal, Toast } from '../components';
import { ReportFormData, ToastMessage } from '../types/report';
import { cacheLocation, getCachedLocation } from '../utils/locationCache';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');

// Calculate square size based on screen width with padding
const mapSize = Math.min(width * 0.85, 400);

// Default region (San Francisco) - used as fallback
const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  // Start with default region for immediate render
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [locationAccuracy, setLocationAccuracy] = useState<'cached' | 'approximate' | 'precise' | 'error'>('cached');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage>({
    type: 'success',
    message: '',
    visible: false,
  });

  const mapRef = useRef<MapView>(null);
  const hasAnimatedToLocation = useRef<boolean>(false);

  /**
   * Optimized location loading with 3-stage approach:
   * 1. Load cached location immediately (if available)
   * 2. Get approximate location quickly (low accuracy)
   * 3. Refine to precise location in background (high accuracy)
   */
  useEffect(() => {
    let isMounted = true;

    const loadLocation = async () => {
      try {
        // STAGE 1: Try to load cached location first (instant)
        const cached = await getCachedLocation();
        if (cached && isMounted) {
          setRegion(cached);
          setLocationAccuracy('cached');
          console.log('📍 Loaded cached location');
        }

        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoadingLocation(false);
          setLocationAccuracy('error');
          return;
        }

        // STAGE 2: Get approximate location quickly (1-3 seconds)
        try {
          const approximateLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced, // Faster, uses network/WiFi
          });

          if (isMounted) {
            const newRegion: Region = {
              latitude: approximateLocation.coords.latitude,
              longitude: approximateLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            setRegion(newRegion);
            setLocationAccuracy('approximate');
            setIsLoadingLocation(false);
            console.log('📍 Got approximate location');

            // Animate to new location if map is ready
            if (mapRef.current && !hasAnimatedToLocation.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
              hasAnimatedToLocation.current = true;
            }

            // Cache this location
            await cacheLocation(newRegion);
          }
        } catch (approxError) {
          console.warn('Failed to get approximate location:', approxError);
        }

        // STAGE 3: Get precise location in background (5-15 seconds)
        try {
          const preciseLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High, // Most accurate, uses GPS
          });

          if (isMounted) {
            const preciseRegion: Region = {
              latitude: preciseLocation.coords.latitude,
              longitude: preciseLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            setRegion(preciseRegion);
            setLocationAccuracy('precise');
            console.log('📍 Got precise location');

            // Smoothly animate to precise location
            if (mapRef.current) {
              mapRef.current.animateToRegion(preciseRegion, 1000);
            }

            // Update cache with precise location
            await cacheLocation(preciseRegion);
          }
        } catch (preciseError) {
          console.warn('Failed to get precise location:', preciseError);
          // Not critical - we already have approximate location
        }

        setIsLoadingLocation(false);
      } catch (error) {
        console.error('Location error:', error);
        if (isMounted) {
          setErrorMsg('Error getting location');
          setIsLoadingLocation(false);
          setLocationAccuracy('error');
        }
      }
    };

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmitReport = (data: ReportFormData) => {
    console.log('Report Submitted:');
    console.log('Title:', data.title);
    console.log('Description:', data.description);
    console.log('Category:', data.category);
    console.log('Image URI:', data.imageUri);

    // Close modal
    setModalVisible(false);

    // Show success toast
    setToast({
      type: 'success',
      message: 'Report submitted successfully!',
      visible: true,
    });
  };

  const handleHideToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Render location accuracy indicator
  const renderLocationIndicator = () => {
    if (!isLoadingLocation && locationAccuracy !== 'error') return null;

    let indicatorText = '';
    let indicatorColor = '#666';

    switch (locationAccuracy) {
      case 'cached':
        indicatorText = '📍 Using cached location...';
        indicatorColor = '#ff9800';
        break;
      case 'approximate':
        indicatorText = '📍 Refining location...';
        indicatorColor = '#2196f3';
        break;
      case 'precise':
        indicatorText = '✓ Location accurate';
        indicatorColor = '#4caf50';
        break;
      case 'error':
        indicatorText = errorMsg || 'Location unavailable';
        indicatorColor = '#f44336';
        break;
    }

    return (
      <View style={styles.locationIndicator}>
        <Text style={[styles.locationIndicatorText, { color: indicatorColor }]}>
          {indicatorText}
        </Text>
        {isLoadingLocation && <ActivityIndicator size="small" color={indicatorColor} style={styles.indicatorSpinner} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Solar Village</Text>

      {/* Location accuracy indicator */}
      {renderLocationIndicator()}

      {/* Map renders immediately with default/cached region */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={locationAccuracy !== 'error'}
        showsMyLocationButton={locationAccuracy !== 'error'}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.primary}
        loadingBackgroundColor="#f5f5f5"
      />
      <Button label="Submit New Report" onPress={handleOpenModal} primary />

      {/* Report Form Modal */}
      <ReportFormModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReport}
      />

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={handleHideToast}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    minHeight: 24,
  },
  locationIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  indicatorSpinner: {
    marginLeft: 8,
  },
  map: {
    width: mapSize,
    height: mapSize,
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    padding: 20,
  },
});

