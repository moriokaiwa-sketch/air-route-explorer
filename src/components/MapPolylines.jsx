import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export default function MapPolylines({ origin, airports }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !origin) return;

    const polylines = [];

    origin.connections.forEach(targetCode => {
      const target = airports.find(a => a.code === targetCode);
      if (!target) return;

      const path = [
        { lat: origin.lat, lng: origin.lng },
        { lat: target.lat, lng: target.lng }
      ];

      const polyline = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#CC0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });

      polylines.push({ polyline });
    });

    return () => {
      polylines.forEach(p => {
        p.polyline.setMap(null);
      });
    };
  }, [map, origin, airports]);

  return null;
}
