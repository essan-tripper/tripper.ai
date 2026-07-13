const BOUNDS = {
  minLat: 6,
  maxLat: 38,
  minLng: 66,
  maxLng: 98,
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1000;

export type Point = { x: number; y: number };

export function project(lat: number, lng: number): Point {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEWBOX_WIDTH;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEWBOX_HEIGHT;
  return { x, y };
}
