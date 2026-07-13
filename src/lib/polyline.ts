import { jyotirlingas } from '@/data/jyotirlingas';
import { project, type Point } from '@/lib/projection';
import { catmullRom } from '@/lib/catmull-rom';

const SAMPLES_PER_SEGMENT = 20;

// Pre-compute the 12 anchor points (projected from lat/lng)
const anchors: Point[] = jyotirlingas.map((j) => project(j.coords.lat, j.coords.lng));

// Pre-compute the full polyline (Catmull-Rom sampled densely)
export const polyline: Point[] = [];

for (let i = 0; i < anchors.length - 1; i++) {
  const p0 = anchors[Math.max(0, i - 1)];                // CLAMP at start
  const p1 = anchors[i];
  const p2 = anchors[i + 1];
  const p3 = anchors[Math.min(anchors.length - 1, i + 2)]; // CLAMP at end
  for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
    const t = s / SAMPLES_PER_SEGMENT;
    polyline.push(catmullRom(p0, p1, p2, p3, t));
  }
}
polyline.push(anchors[anchors.length - 1]);

// Also export the 12 anchor points for the dots
export const dotPositions: Point[] = anchors;

// Sanity check: polyline.length should be 11 * 20 + 1 = 221
export const POLYLINE_LENGTH = polyline.length;
