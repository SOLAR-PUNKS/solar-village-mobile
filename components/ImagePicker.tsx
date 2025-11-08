import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';

import { Colors } from '../theme';

type Props = {
  imageUri: string | null;
  removeImage: () => void;
  showImagePickerOptions: () => void;
}

const ImagePicker = ({imageUri, removeImage, showImagePickerOptions}: Props) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>Image (Optional)</Text>

    {imageUri ? (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
          <Ionicons name="close-circle" size={32} color={Colors.error} />
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.imagePickerButton} onPress={showImagePickerOptions}>
        <Ionicons name="camera-outline" size={32} color={Colors.primary} />
        <Text style={styles.imagePickerText}>Add Image (Optional)</Text>
      </TouchableOpacity>
    )}
  </View>
);

const requestPermissions = async (): Promise<boolean> => {
  const cameraPermission = await ExpoImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryPermission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

  if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
    Alert.alert(
      'Permissions Required',
      'Camera and photo library permissions are required to add images.',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

export const pickImageFromGallery = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  const result = await ExpoImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }

  return;
};

export const takePhoto = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  const result = await ExpoImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }
  return;
};

export default ImagePicker;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePickerText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
});