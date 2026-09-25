import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteWaypoint } from '../../types';

interface LeafletMapProps {
  waypoints: RouteWaypoint[];
  activeDay?: number | null; // null = all days
  height?: string;
  focusLocation?: { lat: number; lng: number } | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  waypoints,
  activeDay = null,
  height = '420px',
  focusLocation = null,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center in central Karnataka (near Chikkamagaluru / Hassan)
    const map = L.map(mapContainerRef.current, {
      center: [13.5, 75.8],
      zoom: 7,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Update Markers & Polylines whenever waypoints or activeDay change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (waypoints.length === 0) return;

    // Filter waypoints by active day if requested
    const filteredWaypoints =
      activeDay !== null && activeDay !== undefined
        ? waypoints.filter(w => w.type === 'start' || w.day === activeDay || w.type === 'end')
        : waypoints;

    const latLngs: [number, number][] = [];

    // Helper for custom styled div icons
    filteredWaypoints.forEach((wp, index) => {
      const isStart = wp.type === 'start';
      const isEnd = wp.type === 'end';

      let pinColor = 'bg-emerald-600 border-white text-white';
      let label = `${wp.day || index + 1}`;

      if (isStart) {
        pinColor = 'bg-blue-600 border-white text-white';
        label = 'Start';
      } else if (isEnd) {
        pinColor = 'bg-amber-600 border-white text-white';
        label = 'End';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="flex flex-col items-center group -translate-x-1/2 -translate-y-full cursor-pointer">
            <div class="${pinColor} shadow-lg rounded-full px-2 py-0.5 text-[11px] font-bold border-2 flex items-center justify-center whitespace-nowrap shadow-emerald-950/20 transform transition-transform group-hover:scale-110">
              ${label}
            </div>
            <div class="w-2 h-2 rotate-45 ${pinColor.split(' ')[0]} -mt-1"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([wp.latitude, wp.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div class="p-1 text-stone-800 font-sans">
          <div class="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">Day ${wp.day} ${wp.district ? `• ${wp.district}` : ''}</div>
          <div class="font-bold text-sm text-stone-900 mt-0.5">${wp.name}</div>
          <div class="text-xs text-stone-500 mt-1 capitalize">${wp.type} waypoint on route</div>
        </div>
      `);

      marker.addTo(layerGroup);
      latLngs.push([wp.latitude, wp.longitude]);
    });

    // Draw connecting roadmap route line
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#059669', // Tailwind emerald-600
        weight: 4,
        opacity: 0.85,
        dashArray: '6, 8',
      });
      polyline.addTo(layerGroup);
    }

    // Fit map bounds to encompass visible points
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [waypoints, activeDay]);

  // Handle programmatic focus
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusLocation) return;
    map.flyTo([focusLocation.lat, focusLocation.lng], 13, { duration: 1.2 });
  }, [focusLocation]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm bg-stone-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm text-xs font-medium text-stone-700 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Interactive Karnataka Route Map</span>
      </div>
    </div>
  );
};
