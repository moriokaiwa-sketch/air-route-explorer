import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapContainer from './components/MapContainer';
import FlightBoard from './components/FlightBoard';
import RoutePanel from './components/RoutePanel';
import { AIRPORTS } from './data/airports';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  const [selectedAirportCode, setSelectedAirportCode] = useState(null);
  const [routeFlights, setRouteFlights] = useState([]);

  const selectedAirport = AIRPORTS.find(a => a.code === selectedAirportCode);

  const handleSelectFlight = (flight) => {
    if (!flight.destinationCode) return;
    setRouteFlights([...routeFlights, { from: selectedAirportCode, to: flight.destinationCode, flight }]);
    setSelectedAirportCode(flight.destinationCode);
  };

  const handleClearRoute = () => {
    setRouteFlights([]);
    setSelectedAirportCode(null);
  };

  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Google Maps API Key が設定されていません</h1>
          <p className="text-gray-400">プロジェクトルートに <code>.env.local</code> ファイルを作成し、<br /><code>VITE_GOOGLE_MAPS_API_KEY=あなたのAPIキー</code> を設定してください。</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
        <MapContainer 
          airports={AIRPORTS}
          selectedAirportCode={selectedAirportCode}
          onSelectAirport={setSelectedAirportCode}
          routeFlights={routeFlights}
        />
        <RoutePanel routeFlights={routeFlights} onClear={handleClearRoute} />
        <FlightBoard 
          airportCode={selectedAirportCode} 
          airportName={selectedAirport ? selectedAirport.name : ''}
          onClose={() => setSelectedAirportCode(null)} 
          onSelectFlight={handleSelectFlight}
        />
      </div>
    </APIProvider>
  );
}
