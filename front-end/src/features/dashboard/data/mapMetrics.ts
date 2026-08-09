import { seededRandom } from "./randomSeed";

/**
 * Generic per-state count metric — deliberately not tied to any real
 * domain (no accidents, no corridors). Skewed so most states are 0 or
 * low with a handful of standouts, spanning the Project Distribution
 * map's 6-tier legend (0 / 1-5 / 5-20 / 20-50 / 50-100 / 100+).
 */
export function generateStateCount(stateName: string): number {
  const rng = seededRandom(`project-count-${stateName}`);
  const roll = rng();

  if (roll < 0.3) return 0;
  if (roll < 0.55) return Math.round(1 + rng() * 4);
  if (roll < 0.75) return Math.round(5 + rng() * 15);
  if (roll < 0.88) return Math.round(20 + rng() * 30);
  if (roll < 0.96) return Math.round(50 + rng() * 50);
  return Math.round(100 + rng() * 80);
}

/** A generic 0-100 "activity" reading per state, for the Activity Intensity heatmap. */
export function generateActivityIntensity(stateName: string): number {
  const rng = seededRandom(`activity-intensity-${stateName}`);
  return Math.round(rng() * 100);
}

/** A short, gently-upward-trending sequence for a sparkline — not a real time series. */
export function generateSparkline(seed: string, points = 7): number[] {
  const rng = seededRandom(seed);
  let value = 5 + rng() * 5;

  return Array.from({ length: points }, () => {
    value = Math.max(1, value + (rng() - 0.35) * 4);
    return Math.round(value * 10) / 10;
  });
}
