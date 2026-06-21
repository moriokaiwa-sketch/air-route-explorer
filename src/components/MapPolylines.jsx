import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export default function MapPolylines({ origin, airports, routeFlights = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylines = [];

    if (routeFlights && routeFlights.length > 0) {
      routeFlights.forEach(segment => {
        const fromA = airports.find(a => a.code === segment.from);
        const toA = airports.find(a => a.code === segment.to);
        if (!fromA || !toA) return;

        const path = [
          { lat: fromA.lat, lng: fromA.lng },
          { lat: toA.lat, lng: toA.lng }
        ];

        const polyline = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#10B981', // Emerald
          strokeOpacity: 0.9,
          strokeWeight: 4,
          map,
        });
        polylines.push({ polyline });
      });
    }
    
    if (origin) {
      origin.connections.forEach(targetCode => {
        const target = airports.find(a => a.code === targetCode);
        if (!target) return;

        const isAlreadyInRoute = routeFlights && routeFlights.some(r => r.from === origin.code && r.to === targetCode);
        if (isAlreadyInRoute) return;

        const path = [
          { lat: origin.lat, lng: origin.lng },
          { lat: target.lat, lng: target.lng }
        ];

        const polyline = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#CC0000',
          strokeOpacity: routeFlights && routeFlights.length > 0 ? 0.3 : 0.8,
          strokeWeight: routeFlights && routeFlights.length > 0 ? 2 : 3,
          map,
        });

        polylines.push({ polyline });
      });
    }

    return () => {
      polylines.forEach(p => {
        p.polyline.setMap(null);
      });
    };
  }, [map, origin, airports, routeFlights]);

  return null;
}
