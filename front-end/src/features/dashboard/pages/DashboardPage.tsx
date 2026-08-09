import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, FolderKanban, Info, Users as UsersIcon } from "lucide-react";

import { GeoMap, type RegionLayer } from "@/shared";

import { geoDataApi, type IndiaStateProperties } from "../api/geoDataApi";
import { GradientLegend } from "../components/GradientLegend";
import { MapLegend } from "../components/MapLegend";
import { StatCard } from "../components/StatCard";
import { generateActivityIntensity, generateStateCount } from "../data/mapMetrics";
import { generateOverviewStats } from "../data/overviewStats";
import { buildHoverCard } from "../hoverCard";
import { getHeatmapColor, getProjectCountTier, PROJECT_COUNT_TIER_COLORS } from "../tierStyles";

const numberFormatter = new Intl.NumberFormat("en-US");
const INDIA_CENTER: [number, number] = [22.97, 78.65];
const INDIA_ZOOM = 4;

/** Icon + badge color per overview stat, matched by array position to generateOverviewStats(). */
const STAT_CARD_META: Array<{ icon: typeof FolderKanban; iconBgClassName: string }> = [
  { icon: FolderKanban, iconBgClassName: "bg-primary" },
  { icon: UsersIcon, iconBgClassName: "bg-accent-green" },
  { icon: FileText, iconBgClassName: "bg-accent-orange" },
];

function formatDateRangeLabel(): string {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  const day = (date: Date) => new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" }).format(date);
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(end);

  return `${day(start)} – ${day(end)} ${year}`;
}

function DashboardPage() {
  const { data: statesData, isPending, isError } = useQuery({
    queryKey: ["dashboard", "india-states"],
    queryFn: () => geoDataApi.listIndiaStates(),
  });

  const projectCounts = useMemo(() => {
    const map = new Map<string, number>();
    if (!statesData) return map;
    for (const feature of statesData.features) {
      map.set(feature.properties.st_nm, generateStateCount(feature.properties.st_nm));
    }
    return map;
  }, [statesData]);

  const activityValues = useMemo(() => {
    const map = new Map<string, number>();
    if (!statesData) return map;
    for (const feature of statesData.features) {
      map.set(feature.properties.st_nm, generateActivityIntensity(feature.properties.st_nm));
    }
    return map;
  }, [statesData]);

  const maxActivity = useMemo(() => {
    const values = Array.from(activityValues.values());
    return values.length > 0 ? Math.max(...values) : 1;
  }, [activityValues]);

  const projectDistributionLayer: RegionLayer<IndiaStateProperties> | undefined = useMemo(() => {
    if (!statesData) return undefined;

    return {
      id: "india-states-projects",
      data: statesData,
      style: (feature) => {
        const tier = getProjectCountTier(projectCounts.get(feature.properties.st_nm) ?? 0);
        return { color: "#93a4c3", weight: 1, fillColor: PROJECT_COUNT_TIER_COLORS[tier], fillOpacity: 0.92 };
      },
      hoverStyle: (feature) => {
        const tier = getProjectCountTier(projectCounts.get(feature.properties.st_nm) ?? 0);
        return { color: "#1e293b", weight: 2, fillColor: PROJECT_COUNT_TIER_COLORS[tier], fillOpacity: 1 };
      },
      tooltip: (feature) =>
        buildHoverCard(feature.properties.st_nm, [
          ["Projects", String(projectCounts.get(feature.properties.st_nm) ?? 0)],
        ]),
    };
  }, [statesData, projectCounts]);

  const activityIntensityLayer: RegionLayer<IndiaStateProperties> | undefined = useMemo(() => {
    if (!statesData) return undefined;

    return {
      id: "india-states-activity",
      data: statesData,
      style: (feature) => {
        const value = activityValues.get(feature.properties.st_nm) ?? 0;
        return { color: "#ffffff", weight: 0.75, fillColor: getHeatmapColor(value, maxActivity), fillOpacity: 0.88 };
      },
      hoverStyle: (feature) => {
        const value = activityValues.get(feature.properties.st_nm) ?? 0;
        return { color: "#1e293b", weight: 2, fillColor: getHeatmapColor(value, maxActivity), fillOpacity: 1 };
      },
      tooltip: (feature) =>
        buildHoverCard(feature.properties.st_nm, [
          ["Activity", String(activityValues.get(feature.properties.st_nm) ?? 0)],
        ]),
    };
  }, [statesData, activityValues, maxActivity]);

  const projectDistributionLayers = useMemo(
    () => (projectDistributionLayer ? [projectDistributionLayer] : []),
    [projectDistributionLayer],
  );
  const activityIntensityLayers = useMemo(
    () => (activityIntensityLayer ? [activityIntensityLayer] : []),
    [activityIntensityLayer],
  );

  const overviewStats = useMemo(() => generateOverviewStats(), []);
  const dateRangeLabel = useMemo(() => formatDateRangeLabel(), []);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Visualize project insights across India</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            defaultValue="All India"
            aria-label="Region filter"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
          >
            <option>All India</option>
          </select>
          <span className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
            {dateRangeLabel}
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overviewStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={numberFormatter.format(stat.value)}
            icon={STAT_CARD_META[index].icon}
            iconBgClassName={STAT_CARD_META[index].iconBgClassName}
            trendPercent={stat.trendPercent}
          />
        ))}
      </div>

      {isError && <p className="text-sm text-red-600">Failed to load India state boundaries.</p>}
      {isPending && !isError && <p className="text-sm text-gray-500">Loading maps…</p>}

      {!isPending && !isError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">India Map – Project Distribution</h2>
                <p className="text-sm text-gray-500">Project distribution by state</p>
              </div>
              <select
                defaultValue="All States"
                aria-label="State filter"
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option>All States</option>
              </select>
            </div>

            <GeoMap
              regionLayers={projectDistributionLayers}
              center={INDIA_CENTER}
              zoom={INDIA_ZOOM}
              height={480}
              fitToData
              overlays={{ bottomRight: <MapLegend title="Project Count" /> }}
            />

            <p className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
              <Info aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" />
              Darker shade indicates higher project count
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">India Map – Activity Intensity</h2>
                <p className="text-sm text-gray-500">Activity intensity heatmap</p>
              </div>
              <select
                defaultValue="All States"
                aria-label="State filter"
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option>All States</option>
              </select>
            </div>

            <GeoMap
              regionLayers={activityIntensityLayers}
              center={INDIA_CENTER}
              zoom={INDIA_ZOOM}
              height={480}
              fitToData
              overlays={{ bottomRight: <GradientLegend title="Activity Intensity" labels={["High", "Medium", "Low"]} /> }}
            />

            <p className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
              <Info aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" />
              Red indicates high activity intensity, Blue indicates low
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
