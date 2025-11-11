import { Region } from 'react-native-maps';
import { TransformedLocation } from './api';
import { calculateDistance } from '../components/Map';
import { MAX_LOCATION_DISTANCE_MILES } from './config';

/**
 * Filter locations to only show those within a specified distance from the user's location
 * @param locations Array of locations to filter
 * @param userRegion User's current location region
 * @param maxDistanceMiles Maximum distance in miles (default: 200)
 * @returns Filtered array of locations within the specified distance
 */
export const filterLocationsByDistance = (
  locations: TransformedLocation[],
  userRegion: Region,
  maxDistanceMiles: number = MAX_LOCATION_DISTANCE_MILES
): TransformedLocation[] => {
  return locations.filter(location => {
    const distance = calculateDistance(
      userRegion.latitude,
      userRegion.longitude,
      location.coordinates.latitude,
      location.coordinates.longitude
    );
    return distance <= maxDistanceMiles;
  });
};

/**
 * Get the count of locations within the specified distance
 * @param locations Array of locations to count
 * @param userRegion User's current location region
 * @param maxDistanceMiles Maximum distance in miles (default: 200)
 * @returns Number of locations within the specified distance
 */
export const getLocationCountWithinDistance = (
  locations: TransformedLocation[],
  userRegion: Region,
  maxDistanceMiles: number = MAX_LOCATION_DISTANCE_MILES
): number => {
  return filterLocationsByDistance(locations, userRegion, maxDistanceMiles).length;
};