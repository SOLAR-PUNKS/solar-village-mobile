import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Button, ReportFormModal, Toast } from '../components';
import { ReportFormData, ToastMessage } from '../types/report';

const { width } = Dimensions.get('window');

// Calculate square size based on screen width with padding
const mapSize = Math.min(width * 0.85, 400);

export default function HomeScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage>({
    type: 'success',
    message: '',
    visible: false,
  });

  const DEFAULT_REGION: Region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          // Set default region if permission denied
          setRegion(DEFAULT_REGION);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);
      } catch (error) {
        setErrorMsg('Error getting location');
        setLoading(false);
        // Set default region on error
        setRegion(DEFAULT_REGION);
      }
    })();
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg || 'Unable to load map'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Solar Village</Text>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
    color: '#2d5016',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    padding: 20,
  },
});

