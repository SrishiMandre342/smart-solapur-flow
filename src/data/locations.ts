// Solapur Locations for dropdown selection
export interface SolapurLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const solapurLocations: SolapurLocation[] = [
  {
    id: 'railway-station',
    name: 'Solapur Railway Station',
    lat: 17.6555,
    lng: 75.9020,
    description: 'Central railway hub',
  },
  {
    id: 'sadar-bazaar',
    name: 'Sadar Bazaar',
    lat: 17.6620,
    lng: 75.9080,
    description: 'Main commercial market',
  },
  {
    id: 'bus-stand',
    name: 'Solapur Bus Stand',
    lat: 17.6580,
    lng: 75.9050,
    description: 'Central bus terminus',
  },
  {
    id: 'sakhar-peth',
    name: 'Sakhar Peth',
    lat: 17.6640,
    lng: 75.9100,
    description: 'Sugar market area',
  },
  {
    id: 'akkalkot-road',
    name: 'Akkalkot Road',
    lat: 17.6510,
    lng: 75.9210,
    description: 'Highway corridor',
  },
  {
    id: 'midc',
    name: 'MIDC',
    lat: 17.6450,
    lng: 75.8920,
    description: 'Industrial development area',
  },
  {
    id: 'shivaji-chowk',
    name: 'Shivaji Chowk',
    lat: 17.6600,
    lng: 75.9070,
    description: 'Central city square',
  },
  {
    id: 'mangalwar-peth',
    name: 'Mangalwar Peth',
    lat: 17.6630,
    lng: 75.9090,
    description: 'Residential locality',
  },
];

// Helper to find nearby zones within radius (km)
export const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
