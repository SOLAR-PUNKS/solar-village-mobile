import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region } from 'react-native-maps';

const LOCATION_CACHE_KEY = '@solar_village_last_location';
const CACHE_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

export interface CachedLocation {
  region: Region;
  timestamp: number;
}

/**
 * Save user's location to cache for faster subsequent loads
 */
export const cacheLocation = async (region: Region): Promise<void> => {
  try {
    const cacheData: CachedLocation = {
      region,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache location:', error);
  }
};

/**
 * Get cached location if available and not expired
 * Returns null if cache is invalid or expired
 */
export const getCachedLocation = async (): Promise<Region | null> => {
  try {
    const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;

    const cacheData: CachedLocation = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;

    // Return cached location if less than 30 minutes old
    if (age < CACHE_EXPIRY_MS) {
      return cacheData.region;
    }

    // Cache expired, remove it
    await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
    return null;
  } catch (error) {
    console.warn('Failed to get cached location:', error);
    return null;
  }
};

/**
 * Clear location cache
 */
export const clearLocationCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear location cache:', error);
  }
};

