import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export interface IndiaStateProperties {
  st_nm: string;
  st_code: string;
}

/**
 * Static India state-boundary GeoJSON served from public/ — simplified
 * (dissolved from district-level, geometry reduced ~3%) from an open
 * dataset (udit-001/india-maps-data, itself derived from GADM) down to
 * ~22KB so it loads instantly and never touches the JS bundle.
 */
export const geoDataApi = {
  async listIndiaStates(): Promise<FeatureCollection<Polygon | MultiPolygon, IndiaStateProperties>> {
    const response = await fetch("/data/india-states.geojson");
    if (!response.ok) {
      throw new Error(`Failed to load India state boundaries: ${String(response.status)}`);
    }
    return (await response.json()) as FeatureCollection<Polygon | MultiPolygon, IndiaStateProperties>;
  },
};

export type IndiaStateFeature = Feature<Polygon | MultiPolygon, IndiaStateProperties>;
