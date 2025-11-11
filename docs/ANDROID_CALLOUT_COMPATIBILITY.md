# Android Callout Compatibility

## Issue
Custom callouts on Android devices often have rendering issues with react-native-maps:
- Complex nested views can cause sizing problems
- Only partial callout visibility (e.g., just the bottom portion)
- TouchableOpacity inside callouts doesn't work reliably

## Solution Implemented

The Map component now uses a platform-specific approach:

### iOS
- Rich interactive callout with embedded TouchableOpacity button
- Displays: title, address, hours, and "Get Directions" button
- Fully interactive within the callout

### Android (Automatic)
- Uses native marker callouts (title + description)
- Automatically shows an Alert dialog when callout is tapped
- Alert contains: title, address, hours, and direction options
- More reliable than custom views on Android

## Implementation Details

The component automatically detects Android and:
1. Sets `title` and `description` props on the Marker
2. Uses `onCalloutPress` to show an Alert with navigation options
3. Skips custom Callout components entirely on Android

## Configuration Options

### Option 1: Native Android Callouts (Recommended)
```tsx
<Map
  useNativeAndroidCallouts={true}  // Android uses native callouts, iOS uses custom
/>
```
This prevents the height cutoff issue by using Android's native callout system.

### Option 2: Custom Android Callouts
```tsx
<Map
  useNativeAndroidCallouts={false}  // Uses custom callout on Android with fixed height
/>
```
Uses a custom callout designed specifically for Android with proper height management.

### Option 3: Universal Simple Callouts
```tsx
<Map
  useSimpleCallouts={true}  // Forces native callouts on all platforms
/>
```

## Testing

Expected behavior:
1. **iOS**: Rich custom callouts with interactive button
2. **Android**: Native callouts that open Alert dialog when tapped
3. **Both**: Navigation opens when selecting "Get Directions"