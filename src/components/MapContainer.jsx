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
        let isConnected = false;
        let isFaded = false;
        let isHidden = false;

        if (routeFlights && routeFlights.length > 0) {
          const inRoute = routeFlights.some(r => r.from === airport.code || r.to === airport.code);
          const isCurrentSelection = selectedAirportCode === airport.code;
          
          if (!inRoute && !isCurrentSelection) {
            isHidden = true;
          } else {
            isSelected = isCurrentSelection;
            isConnected = inRoute && !isCurrentSelection;
          }
        } else {
          isSelected = selectedAirportCode === airport.code;
          isConnected = selectedAirport && selectedAirport.connections.includes(airport.code);
          isFaded = selectedAirportCode && !isSelected && !isConnected;
        }

        if (isHidden) return null;

        return (
          <AdvancedMarker
            key={airport.code}
            position={{ lat: airport.lat, lng: airport.lng }}
            onClick={() => onSelectAirport(airport.code)}
            zIndex={isSelected ? 100 : (isConnected ? 50 : 10)}
          >
            <Pin
              background={isSelected ? '#CC0000' : (isConnected && routeFlights.length > 0 ? '#10B981' : (isFaded ? '#ffffff44' : '#ffffff'))}
              borderColor={isSelected ? '#7A0000' : (isConnected && routeFlights.length > 0 ? '#047857' : (isFaded ? '#cccccc44' : '#cccccc'))}
              glyphColor={isSelected ? '#ffffff' : (isConnected && routeFlights.length > 0 ? '#ffffff' : (isFaded ? 'transparent' : '#000000'))}
              scale={isSelected ? 1.2 : (isConnected && routeFlights.length > 0 ? 1.0 : (isFaded ? 0.6 : 1))}
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
