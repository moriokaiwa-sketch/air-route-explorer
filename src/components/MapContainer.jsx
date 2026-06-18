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

export default function MapContainer({ airports, selectedAirportCode, onSelectAirport }) {
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
        const isSelected = selectedAirportCode === airport.code;
        const isConnected = selectedAirport && selectedAirport.connections.includes(airport.code);
        const isFaded = selectedAirportCode && !isSelected && !isConnected;

        return (
          <AdvancedMarker
            key={airport.code}
            position={{ lat: airport.lat, lng: airport.lng }}
            onClick={() => onSelectAirport(airport.code)}
            zIndex={isSelected ? 100 : (isConnected ? 50 : 10)}
          >
            <Pin
              background={isSelected ? '#CC0000' : (isFaded ? '#ffffff44' : '#ffffff')}
              borderColor={isSelected ? '#7A0000' : (isFaded ? '#cccccc44' : '#cccccc')}
              glyphColor={isSelected ? '#ffffff' : (isFaded ? 'transparent' : '#000000')}
              scale={isSelected ? 1.2 : (isFaded ? 0.6 : 1)}
            />
          </AdvancedMarker>
        );
      })}

      {selectedAirport && (
        <MapPolylines origin={selectedAirport} airports={airports} />
      )}
    </Map>
  );
}
