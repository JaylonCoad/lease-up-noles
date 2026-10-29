const EARTH_RADIUS_MILES = 3958.7613;

export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  for (const latitude of [lat1, lat2]) {
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      throw new RangeError("Latitude must be between -90 and 90.");
    }
  }

  for (const longitude of [lng1, lng2]) {
    if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new RangeError("Longitude must be between -180 and 180.");
    }
  }

  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lng2 - lng1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDifference / 2) ** 2;

  // Prevent floating-point rounding from putting a outside 0–1.
  const clampedA = Math.max(0, Math.min(1, a));

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(clampedA));
}

// Fixed campus reference: Westcott Fountain, from Apple Maps.
export const FSU_REFERENCE_POINT = {
  lat: 30.44072,
  lng: -84.29115,
} as const;

export function distanceToCampusMiles(lat: number, lng: number): number {
  return haversineMiles(lat, lng, FSU_REFERENCE_POINT.lat, FSU_REFERENCE_POINT.lng);
}
