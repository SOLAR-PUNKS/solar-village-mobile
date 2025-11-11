/**
 * Test script to verify the distance filtering logic
 * This can be used to ensure the locationFilter utility works as expected
 */

import { Region } from 'react-native-maps';
import { TransformedLocation } from './api';
import { filterLocationsByDistance } from './locationFilter';

// Mock user location (San Francisco)
const userLocation: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock test locations at various distances
const testLocations: TransformedLocation[] = [
  {
    key: 'nearby-1',
    id: 1,
    title: 'Nearby Location 1',
    description: 'Very close location',
    coordinates: { latitude: 37.7849, longitude: -122.4094 }, // ~1 mile away
    address: '123 Nearby St',
    phone: undefined,
    email: undefined,
    website: undefined,
    hours: {},
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    resource_type: 'test',
    resource_type_display: 'Test Resource'
  },
  {
    key: 'far-1',
    id: 2,
    title: 'Far Location 1',
    description: 'Location in Los Angeles',
    coordinates: { latitude: 34.0522, longitude: -118.2437 }, // ~350 miles away
    address: '456 Far St',
    phone: undefined,
    email: undefined,
    website: undefined,
    hours: {},
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    resource_type: 'test',
    resource_type_display: 'Test Resource'
  },
  {
    key: 'medium-1',
    id: 3,
    title: 'Medium Distance Location',
    description: 'Location in Sacramento',
    coordinates: { latitude: 38.5816, longitude: -121.4944 }, // ~90 miles away
    address: '789 Medium St',
    phone: undefined,
    email: undefined,
    website: undefined,
    hours: {},
    city: 'Sacramento',
    state: 'CA',
    zip_code: '95814',
    resource_type: 'test',
    resource_type_display: 'Test Resource'
  }
];

/**
 * Run distance filtering test
 */
export const testDistanceFiltering = () => {
  console.log('🧪 Testing distance filtering...');
  
  // Test with 200 mile radius
  const filtered200 = filterLocationsByDistance(testLocations, userLocation, 200);
  console.log(`📍 With 200 mile radius: ${testLocations.length} → ${filtered200.length} locations`);
  filtered200.forEach(loc => console.log(`  ✅ ${loc.title} (${loc.city})`));
  
  // Test with 50 mile radius
  const filtered50 = filterLocationsByDistance(testLocations, userLocation, 50);
  console.log(`📍 With 50 mile radius: ${testLocations.length} → ${filtered50.length} locations`);
  filtered50.forEach(loc => console.log(`  ✅ ${loc.title} (${loc.city})`));
  
  // Test with 500 mile radius (should include all)
  const filtered500 = filterLocationsByDistance(testLocations, userLocation, 500);
  console.log(`📍 With 500 mile radius: ${testLocations.length} → ${filtered500.length} locations`);
  filtered500.forEach(loc => console.log(`  ✅ ${loc.title} (${loc.city})`));
};