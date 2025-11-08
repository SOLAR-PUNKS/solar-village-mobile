import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  ReportFormModalProps,
  ReportFormData,
  ReportFormErrors,
  ReportCategory,
  ReportType
} from '../../types/report';
import { Button } from '../index';
import { Colors } from '../../theme';
import { CATEGORIES, validateForm } from './utils';
import {
  ImagePicker,
  pickImageFromGallery,
  ReportTypeSelector,
  Required,
  takePhoto
} from '..';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export default function ReportFormModal({ visible, onClose, onSubmit }: ReportFormModalProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [type, setType] = useState<ReportType>('Offer');
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<ReportFormErrors>({});

  const handleSubmit = () => {
    const errors = validateForm({title, description, category, imageUri});
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const formData: ReportFormData = {
        title: title.trim(),
        description: description.trim(),
        category,
        imageUri,
        type,
      };
      console.log('Report submitted:', formData);
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(null);
    setType('Offer');
    setImageUri(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePickImageFromGallery = () => {
    pickImageFromGallery().then((uri) => {
      if (uri) {
        setImageUri(uri);
      }
    });
  }

  const handleTakePhoto = () => {
    takePhoto().then((uri) => {
      if (uri) {
        setImageUri(uri);
      }
    });
  }

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handlePickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Submit New Report</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={styles.formContentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
              <ReportTypeSelector
                onSelectionChange={setType}
                type={type}
              />
              {/* Title Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Title <Required />
                </Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Enter report title"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={TITLE_MAX_LENGTH}
                />
                <Text style={styles.charCount}>
                  {title.length}/{TITLE_MAX_LENGTH}
                </Text>
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Description Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Description <Required />
                </Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the issue or report details"
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                  {description.length}/{DESCRIPTION_MAX_LENGTH}
                </Text>
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              {/* Category Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Category <Required />
                </Text>
                <TouchableOpacity
                  style={[styles.categoryPicker, errors.category && styles.inputError]}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text style={[styles.categoryText, !category && styles.placeholderText]}>
                    {category || 'Select a category'}
                  </Text>
                  <Ionicons name="chevron-down" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              </View>

              {/* Category Picker Modal */}
              <Modal
                visible={showCategoryPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCategoryPicker(false)}
              >
                <TouchableOpacity
                  style={styles.pickerOverlay}
                  activeOpacity={1}
                  onPress={() => setShowCategoryPicker(false)}
                >
                  <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Select Category</Text>
                      <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                        <Ionicons name="close" size={24} color={Colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.pickerOption,
                          category === cat && styles.pickerOptionSelected,
                        ]}
                        onPress={() => {
                          setCategory(cat);
                          setShowCategoryPicker(false);
                          // Clear category error when selected
                          if (errors.category) {
                            setErrors({ ...errors, category: undefined });
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            category === cat && styles.pickerOptionTextSelected,
                          ]}
                        >
                          {cat}
                        </Text>
                        {category === cat && (
                          <Ionicons name="checkmark" size={24} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
              <ImagePicker
                imageUri={imageUri}
                removeImage={removeImage}
                showImagePickerOptions={showImagePickerOptions}
              />
              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <View style={styles.submitButtonWrapper}>
                  <Button label="Cancel" onPress={handleClose} />
                </View>
                <View style={styles.submitButtonWrapper}>
                  <Button label="Submit" onPress={handleSubmit} primary />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    maxHeight: '100%',
  },
  formContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    minHeight: 120,
  },
  inputError: {
    borderColor: Colors.error,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionSelected: {
    backgroundColor: '#f0f7ed',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 8,
  },
  submitButtonWrapper: {
    flex: 1,
  },
});

