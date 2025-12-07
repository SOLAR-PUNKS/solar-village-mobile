import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useState } from 'react';
// import Slider from '@react-native-community/slider';
import { Button, SettingsToggle } from '../components';
import { Colors } from '../theme';
import { useAppContext } from '../utils/AppContext';

export default function SettingsScreen() {
  const {
    // showOpenLocationsOnly, 
    // setShowOpenLocationsOnly,
    showNearbyLocationsOnly,
    setShowNearbyLocationsOnly
  } = useAppContext();
  
  // State management
  // const [distance, setDistance] = useState<number>(30);
  // const [showFood, setShowFood] = useState<boolean>(false);
  // const [showHygiene, setShowHygiene] = useState<boolean>(false);
  // const [showClothing, setShowClothing] = useState<boolean>(false);
  // const [showSchoolSupplies, setShowSchoolSupplies] = useState<boolean>(false);

  const handleApply = () => {
    console.log('Settings Applied:');
    // console.log('Distance:', distance, 'miles');
    // console.log('Show Open Locations Only:', showOpenLocationsOnly);
    // console.log('Show Food:', showFood);
    // console.log('Show Hygiene:', showHygiene);
    // console.log('Show Clothing:', showClothing);
    // console.log('Show School Supplies:', showSchoolSupplies);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your app preferences</Text>

        {/* <View style={styles.section}>
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
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={Colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>0</Text>
            <Text style={styles.sliderLabelText}>100</Text>
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location Filters</Text>
          <Text style={styles.sectionDescription}>
            Control which locations are displayed on the map and in the list
          </Text>
          {/* <SettingsToggle
            label="Show only open locations"
            value={showOpenLocationsOnly}
            onChange={setShowOpenLocationsOnly}
          /> */}
          <SettingsToggle
            label="Show only locations in my area (200mi)"
            value={showNearbyLocationsOnly}
            onChange={setShowNearbyLocationsOnly}
          />
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionLabel}>Show Me</Text>
          <SettingsToggle
            label="Food"
            value={showFood}
            onChange={setShowFood}
          />
          <SettingsToggle
            label="Personal Hygiene"
            value={showHygiene}
            onChange={setShowHygiene}
          />
          <SettingsToggle
            label="Clothing"
            value={showClothing}
            onChange={setShowClothing}
          />
          <SettingsToggle
            label="School Supplies"
            value={showSchoolSupplies}
            onChange={setShowSchoolSupplies}
          />
        </View> */}
        {/* <Button label="Apply" onPress={handleApply} primary /> */}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
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
    color: Colors.primary,
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 15,
    lineHeight: 20,
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
    color: Colors.primary,
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
});

