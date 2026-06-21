import React, { useMemo } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import MapPolylines from './MapPolylines';

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ],
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  backgroundColor: '#17263c',
};

export default function MapContainer({ airports, selectedAirportCode, onSelectAirport, routeFlights = [] }) {
  const selectedAirport = useMemo(() => airports.find(a => a.code === selectedAirportCode), [airports, selectedAirportCode]);

  return (
    <Map
      defaultCenter={{ lat: 38.0, lng: 138.0 }}
      defaultZoom={5}
      mapId="DEMO_MAP_ID"
      options={mapOptions}
      className="w-full h-full"
      onClick={() => onSelectAirport(null)}
    >
      {airports.map(airport => {
        let isSelected = false;
        let inRoute = false;
        let isNextDest = false;
        let isFaded = false;
        let isHidden = false;

        if (routeFlights && routeFlights.length > 0) {
          inRoute = routeFlights.some(r => r.from === airport.code || r.to === airport.code);
          isSelected = selectedAirportCode === airport.code;
          isNextDest = selectedAirport && selectedAirport.connections.includes(airport.code);
          
          if (!inRoute && !isSelected && !isNextDest) {
            isHidden = true;
          }
        } else {
          isSelected = selectedAirportCode === airport.code;
          isNextDest = selectedAirport && selectedAirport.connections.includes(airport.code);
          isFaded = selectedAirportCode && !isSelected && !isNextDest;
        }

        if (isHidden) return null;

        let background = '#ffffff';
        let borderColor = '#cccccc';
        let glyphColor = '#000000';
        let scale = 1.0;
        let zIndex = 10;

        if (isSelected) {
          background = '#CC0000';
          borderColor = '#7A0000';
          glyphColor = '#ffffff';
          scale = 1.2;
          zIndex = 100;
        } else if (inRoute) {
          background = '#10B981'; // Emerald for confirmed route
          borderColor = '#047857';
          glyphColor = '#ffffff';
          scale = 1.0;
          zIndex = 50;
        } else if (isNextDest && routeFlights && routeFlights.length > 0) {
          background = '#ffffff';
          borderColor = '#CC0000'; // Red border for next possible destinations
          glyphColor = '#CC0000';
          scale = 0.8;
          zIndex = 40;
        } else if (isNextDest && (!routeFlights || routeFlights.length === 0)) {
          background = '#ffffff';
          borderColor = '#cccccc';
          glyphColor = '#000000';
          scale = 1.0;
          zIndex = 50;
        } else if (isFaded) {
          background = '#ffffff44';
          borderColor = '#cccccc44';
          glyphColor = 'transparent';
          scale = 0.6;
          zIndex = 10;
        }

        return (
          <AdvancedMarker
            key={airport.code}
            position={{ lat: airport.lat, lng: airport.lng }}
            onClick={() => onSelectAirport(airport.code)}
            zIndex={zIndex}
          >
            <Pin
              background={background}
              borderColor={borderColor}
              glyphColor={glyphColor}
              scale={scale}
            />
          </AdvancedMarker>
        );
      })}

      {(selectedAirport || routeFlights.length > 0) && (
        <MapPolylines origin={selectedAirport} airports={airports} routeFlights={routeFlights} />
      )}
    </Map>
  );
}
