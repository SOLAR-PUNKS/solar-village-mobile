import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';

export default function SettingsScreen() {
  // State management
  const [distance, setDistance] = useState<number>(30);
  const [showFood, setShowFood] = useState<boolean>(false);
  const [showHygiene, setShowHygiene] = useState<boolean>(false);
  const [showClothing, setShowClothing] = useState<boolean>(false);
  const [showSchoolSupplies, setShowSchoolSupplies] = useState<boolean>(false);

  const handleApply = () => {
    console.log('Settings Applied:');
    console.log('Distance:', distance, 'miles');
    console.log('Show Food:', showFood);
    console.log('Show Hygiene:', showHygiene);
    console.log('Show Clothing:', showClothing);
    console.log('Show School Supplies:', showSchoolSupplies);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your app preferences</Text>

        <View style={styles.section}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sectionLabel}>Distance</Text>
            <Text style={styles.valueText}>{Math.round(distance)} miles</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#2d5016"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#2d5016"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>0</Text>
            <Text style={styles.sliderLabelText}>100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Show Me</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Food</Text>
            <Switch
              value={showFood}
              onValueChange={setShowFood}
              trackColor={{ false: '#d3d3d3', true: '#7fb069' }}
              thumbColor={showFood ? '#2d5016' : '#f4f3f4'}
              ios_backgroundColor="#d3d3d3"
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Personal Hygiene</Text>
            <Switch
              value={showHygiene}
              onValueChange={setShowHygiene}
              trackColor={{ false: '#d3d3d3', true: '#7fb069' }}
              thumbColor={showHygiene ? '#2d5016' : '#f4f3f4'}
              ios_backgroundColor="#d3d3d3"
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Clothing</Text>
            <Switch
              value={showClothing}
              onValueChange={setShowClothing}
              trackColor={{ false: '#d3d3d3', true: '#7fb069' }}
              thumbColor={showClothing ? '#2d5016' : '#f4f3f4'}
              ios_backgroundColor="#d3d3d3"
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>School Supplies</Text>
            <Switch
              value={showSchoolSupplies}
              onValueChange={setShowSchoolSupplies}
              trackColor={{ false: '#d3d3d3', true: '#7fb069' }}
              thumbColor={showSchoolSupplies ? '#2d5016' : '#f4f3f4'}
              ios_backgroundColor="#d3d3d3"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 15,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#999',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

