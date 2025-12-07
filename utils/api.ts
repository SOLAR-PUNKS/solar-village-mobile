// API utility functions for fetching community resources

import { USE_LOCAL_TEST_DATA } from './config';
import { TEST_LOCATIONS } from './testData';
import laData from './la_data.json';

const API_BASE_URL = 'https://solar-village-backend.onrender.com/api';

export interface ApiLocation {
  id: number;
  resource_type: string;
  resource_type_display: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: Record<string, { open: string; close: string } | string>;
  hours_display?: string;
  eligibility_requirements?: string;
  services?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiLocation[];
}

// Add interface for LA data structure
interface LaDataItem {
  Name: string;
  Notes: string;
  "Address Short": string;
  "City State Zip": string;
  "Address Consolidated": string;
  Latitude: number;
  Longitude: number;
}

// Extend TransformedLocation to include notes field
export interface TransformedLocation {
  key: string;
  id: number;
  title: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  hours?: Record<string, { open: string; close: string } | string>;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  resource_type?: string;
  resource_type_display?: string;
  notes?: string; // Add notes field
}

/**
 * Convert 24-hour time format (e.g., "09:00") to 12-hour format (e.g., "09:00 AM")
 */
const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
};

/**
 * Transform API location to app location format
 */
export const transformApiLocation = (apiLocation: ApiLocation): TransformedLocation => {
  // Create key from coordinates (same format as before)
  const key = `${apiLocation.location.latitude}, ${apiLocation.location.longitude}`;
  
  // Transform hours from 24-hour format to 12-hour format if needed
  let transformedHours: Record<string, { open: string; close: string } | string> | undefined;
  if (apiLocation.hours) {
    transformedHours = {};
    for (const [day, hoursData] of Object.entries(apiLocation.hours)) {
      if (typeof hoursData === 'string') {
        // Handle "closed" or other string values
        transformedHours[day] = hoursData;
      } else if (hoursData && typeof hoursData === 'object' && 'open' in hoursData && 'close' in hoursData) {
        // Convert 24-hour format to 12-hour format
        transformedHours[day] = {
          open: convertTo12Hour(hoursData.open),
          close: convertTo12Hour(hoursData.close),
        };
      }
    }
  }

  // Build full address string
  const addressParts = [apiLocation.address];
  if (apiLocation.city) addressParts.push(apiLocation.city);
  if (apiLocation.state) addressParts.push(apiLocation.state);
  if (apiLocation.zip_code) addressParts.push(apiLocation.zip_code);
  const fullAddress = addressParts.join(', ');

  return {
    key,
    id: apiLocation.id,
    title: apiLocation.name,
    description: apiLocation.description || '',
    coordinates: {
      latitude: apiLocation.location.latitude,
      longitude: apiLocation.location.longitude,
    },
    address: fullAddress,
    hours: transformedHours,
    city: apiLocation.city,
    state: apiLocation.state,
    zip_code: apiLocation.zip_code,
    phone: apiLocation.phone,
    email: apiLocation.email,
    website: apiLocation.website,
    resource_type: apiLocation.resource_type,
    resource_type_display: apiLocation.resource_type_display,
  };
};

/**
 * Transform LA data to app location format
 */
export const transformLaDataLocation = (laLocation: LaDataItem, index: number): TransformedLocation => {
  // Create key from coordinates
  const key = `${laLocation.Name} - ${laLocation["Address Short"]} - ${laLocation.Latitude}, ${laLocation.Longitude}`;
  
  // TODO -- fix keys and ids
  return {
    key,
    id: index + 10000, // Start IDs at 10000 to avoid conflicts with API data
    title: laLocation.Name,
    description: laLocation.Notes || '',
    coordinates: {
      latitude: laLocation.Latitude,
      longitude: laLocation.Longitude,
    },
    address: laLocation["Address Consolidated"],
    notes: laLocation.Notes,
    resource_type: 'food',
    resource_type_display: 'Food Bank',
  };
};

/**
 * Load and transform LA data from local JSON file
 */
export const loadLaData = (): TransformedLocation[] => {
  try {
    const transformedLocations = (laData as LaDataItem[]).map((location, index) => 
      transformLaDataLocation(location, index)
    );
    
    console.log(`📍 Loaded ${transformedLocations.length} locations from LA data`);
    return transformedLocations;
  } catch (error) {
    console.error('Error loading LA data:', error);
    return [];
  }
};

/**
 * Fetch community resources from the API
 * Falls back to local test data if the global flag is set or if the API fails
 */
export const fetchCommunityResources = async (): Promise<TransformedLocation[]> => {
  // Check if we should use local test data
  if (USE_LOCAL_TEST_DATA) {
    console.log('📍 Using local test data (flag enabled)');
    // return TEST_LOCATIONS;
    return loadLaData();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/community-resources/`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    
    // Filter to only active resources and transform them
    const locations = data.results
      .filter((location) => location.is_active)
      .map(transformApiLocation);
    
    console.log(`📍 Loaded ${locations.length} locations from API`);
    return locations;
  } catch (error) {
    console.error('Error fetching community resources:', error);
    console.log('📍 Falling back to local test data due to API error');
    // Fall back to local test data when API fails
    return TEST_LOCATIONS;
  }
};

