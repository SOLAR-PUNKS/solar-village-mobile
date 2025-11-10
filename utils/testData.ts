/**
 * Hardcoded test location data for offline/development use
 */

import { TransformedLocation } from './api';

/**
 * Sample test locations matching the TransformedLocation interface
 * These are used when the API is unavailable or when USE_LOCAL_TEST_DATA is enabled
 */
export const TEST_LOCATIONS: TransformedLocation[] = [
  {
    key: '37.7749, -122.4194',
    id: 1,
    title: 'San Francisco Community Center',
    description: 'A community center providing food assistance, clothing, and support services.',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    address: '123 Market Street, San Francisco, CA, 94102',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    phone: '(415) 555-0100',
    email: 'info@sfcommunity.org',
    website: 'https://example.com',
    resource_type: 'community_center',
    resource_type_display: 'Community Center',
    hours: {
      monday: { open: '9:00 AM', close: '5:00 PM' },
      tuesday: { open: '9:00 AM', close: '5:00 PM' },
      wednesday: { open: '9:00 AM', close: '5:00 PM' },
      thursday: { open: '9:00 AM', close: '5:00 PM' },
      friday: { open: '9:00 AM', close: '5:00 PM' },
      saturday: { open: '10:00 AM', close: '3:00 PM' },
      sunday: 'closed',
    },
  },
  {
    key: '37.7849, -122.4094',
    id: 2,
    title: 'Oakland Food Bank',
    description: 'Food distribution center offering fresh produce and pantry staples.',
    coordinates: {
      latitude: 37.7849,
      longitude: -122.4094,
    },
    address: '456 Broadway, Oakland, CA, 94607',
    city: 'Oakland',
    state: 'CA',
    zip_code: '94607',
    phone: '(510) 555-0200',
    email: 'contact@oaklandfoodbank.org',
    website: 'https://example.com',
    resource_type: 'food_bank',
    resource_type_display: 'Food Bank',
    hours: {
      monday: { open: '8:00 AM', close: '4:00 PM' },
      tuesday: { open: '8:00 AM', close: '4:00 PM' },
      wednesday: { open: '8:00 AM', close: '4:00 PM' },
      thursday: { open: '8:00 AM', close: '4:00 PM' },
      friday: { open: '8:00 AM', close: '4:00 PM' },
      saturday: { open: '9:00 AM', close: '2:00 PM' },
      sunday: 'closed',
    },
  },
  {
    key: '37.7649, -122.4294',
    id: 3,
    title: 'Mission District Health Clinic',
    description: 'Free health services including medical checkups and mental health support.',
    coordinates: {
      latitude: 37.7649,
      longitude: -122.4294,
    },
    address: '789 Mission Street, San Francisco, CA, 94103',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94103',
    phone: '(415) 555-0300',
    email: 'health@missionclinic.org',
    website: 'https://example.com',
    resource_type: 'health_clinic',
    resource_type_display: 'Health Clinic',
    hours: {
      monday: { open: '8:00 AM', close: '6:00 PM' },
      tuesday: { open: '8:00 AM', close: '6:00 PM' },
      wednesday: { open: '8:00 AM', close: '6:00 PM' },
      thursday: { open: '8:00 AM', close: '6:00 PM' },
      friday: { open: '8:00 AM', close: '6:00 PM' },
      saturday: { open: '9:00 AM', close: '1:00 PM' },
      sunday: 'closed',
    },
  },
  {
    key: '37.7549, -122.4394',
    id: 4,
    title: 'Bayview Resource Center',
    description: 'Comprehensive resource center offering job training, housing assistance, and more.',
    coordinates: {
      latitude: 37.7549,
      longitude: -122.4394,
    },
    address: '321 Third Street, San Francisco, CA, 94124',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94124',
    phone: '(415) 555-0400',
    email: 'help@bayviewcenter.org',
    website: 'https://example.com',
    resource_type: 'resource_center',
    resource_type_display: 'Resource Center',
    hours: {
      monday: { open: '10:00 AM', close: '6:00 PM' },
      tuesday: { open: '10:00 AM', close: '6:00 PM' },
      wednesday: { open: '10:00 AM', close: '6:00 PM' },
      thursday: { open: '10:00 AM', close: '6:00 PM' },
      friday: { open: '10:00 AM', close: '6:00 PM' },
      saturday: 'closed',
      sunday: 'closed',
    },
  },
  {
    key: '37.7949, -122.3994',
    id: 5,
    title: 'North Beach Library & Community Space',
    description: 'Public library with community programs, computer access, and meeting rooms.',
    coordinates: {
      latitude: 37.7949,
      longitude: -122.3994,
    },
    address: '555 Columbus Avenue, San Francisco, CA, 94133',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94133',
    phone: '(415) 555-0500',
    email: 'northbeach@sfpl.org',
    website: 'https://example.com',
    resource_type: 'library',
    resource_type_display: 'Library',
    hours: {
      monday: { open: '10:00 AM', close: '8:00 PM' },
      tuesday: { open: '10:00 AM', close: '8:00 PM' },
      wednesday: { open: '10:00 AM', close: '8:00 PM' },
      thursday: { open: '10:00 AM', close: '8:00 PM' },
      friday: { open: '12:00 PM', close: '6:00 PM' },
      saturday: { open: '10:00 AM', close: '6:00 PM' },
      sunday: { open: '12:00 PM', close: '5:00 PM' },
    },
  },
  {
    key: '35.779982363949365, -78.64105924588402',
    id: 6,
    title: `Shepherd's Table Soup Kitchen`,
    description: '',
    coordinates: {
      latitude: 35.779982363949365,
      longitude: -78.64105924588402
    },
    address: '121 W. Morgan St., Raleigh, NC, 27603',
    city: 'Raleigh',
    state: 'NC',
    zip_code: '27603',
    phone: '',
    email: '',
    website: 'https://example.com',
    resource_type: 'foodBank',
    resource_type_display: 'Food Bank',
    hours: {
      monday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      tuesday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      wednesday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      thursday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
      friday: {
        open: '11:00 AM',
        close: '12:00 PM',
      },
    }
  },
  {
    key: '35.778023468882594, -78.63428830355457',
    id: 7,
    title: `Raleigh Rescue Mission`,
    description: '',
    coordinates: {
      latitude: 35.778023468882594,
      longitude: -78.63428830355457
    },
    address: '314 E Hargett St Raleigh NC 27601',
    city: 'Raleigh',
    state: 'NC',
    zip_code: '27601',
    phone: '',
    email: '',
    website: 'https://example.com',
    resource_type: 'foodBank',
    resource_type_display: 'Food Bank',
    hours: {
      monday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      tuesday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      wednesday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      thursday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      friday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      saturday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
      sunday: {
        open: '12:00 AM',
        close: '12:00 AM',
      },
    }
  },
  {
    key: '35.77951569339792, -78.61689181704875',
    id: 8,
    title: `Lincoln Park Community Outreach Center`,
    description: '',
    coordinates: {
      latitude: 35.77951569339792,
      longitude: -78.61689181704875,
    },
    address: '13 Heath St, Raleigh, NC 27610',
    city: 'Raleigh',
    state: 'NC',
    zip_code: '27610',
    phone: '',
    email: '',
    website: 'https://example.com',
    resource_type: 'foodBank',
    resource_type_display: 'Food Bank',
    hours: {
      tuesday: {
        open: '2:00 PM',
        close: '4:00 PM',
      },
      thursday: {
        open: '2:00 PM',
        close: '4:00 PM',
      },
      saturday: {
        open: '2:00 PM',
        close: '3:00 PM',
      }
    }
  },
];

