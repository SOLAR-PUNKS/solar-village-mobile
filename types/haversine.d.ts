declare module 'haversine' {
  interface Coordinates {
    latitude: number;
    longitude: number;
  }

  interface HaversineOptions {
    unit?: 'km' | 'm' | 'mile' | 'nm';
    format?: string;
  }

  function haversine(
    point1: Coordinates,
    point2: Coordinates,
    options?: HaversineOptions
  ): number;

  export = haversine;
}
