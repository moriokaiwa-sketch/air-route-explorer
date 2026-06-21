import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapContainer from './components/MapContainer';
import FlightBoard from './components/FlightBoard';
import RoutePanel from './components/RoutePanel';
import { AIRPORTS } from './data/airports';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  const [selectedAirportCode, setSelectedAirportCode] = useState(null);
  const [destinationFilterCode, setDestinationFilterCode] = useState(null);
  const [routeFlights, setRouteFlights] = useState([]);

  const selectedAirport = AIRPORTS.find(a => a.code === selectedAirportCode);

  const handleSelectAirport = (clickedCode) => {
    if (!clickedCode) {
      setSelectedAirportCode(null);
      setDestinationFilterCode(null);
      return;
    }

    if (!selectedAirportCode) {
      // First selection
      setSelectedAirportCode(clickedCode);
      setDestinationFilterCode(null);
      return;
    }

    if (clickedCode === selectedAirportCode) {
      // Clicking the already selected origin again toggles filter off
      setDestinationFilterCode(null);
      return;
    }

    // If an origin is selected, and we click a connected airport, use it as a destination filter
    if (selectedAirport && selectedAirport.connections.includes(clickedCode)) {
      if (destinationFilterCode === clickedCode) {
        // Toggle filter off if clicked again
        setDestinationFilterCode(null);
      } else {
        setDestinationFilterCode(clickedCode);
      }
    } else {
      // Clicking somewhere else: start a new selection from that airport
      setSelectedAirportCode(clickedCode);
      setDestinationFilterCode(null);
    }
  };

  const handleSelectFlight = (flight) => {
    if (!flight.destinationCode) return;
    setRouteFlights([...routeFlights, { from: selectedAirportCode, to: flight.destinationCode, flight }]);
    setSelectedAirportCode(flight.destinationCode);
    setDestinationFilterCode(null); // Reset filter
  };

  const handleClearRoute = () => {
    setRouteFlights([]);
    setSelectedAirportCode(null);
  };

  const handleRemoveFlight = (index) => {
    const newRouteFlights = routeFlights.filter((_, i) => i !== index);
    setRouteFlights(newRouteFlights);
    
    if (newRouteFlights.length === 0) {
      setSelectedAirportCode(null);
    } else if (index === routeFlights.length - 1) {
      setSelectedAirportCode(newRouteFlights[newRouteFlights.length - 1].to);
    }
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
          onSelectAirport={handleSelectAirport}
          routeFlights={routeFlights}
          destinationFilterCode={destinationFilterCode}
        />
        
        {/* Right Sidebar containing Route Panel and Flight Board */}
        <div 
          className={`fixed top-0 right-0 bottom-0 z-20 flex flex-col pointer-events-none transition-transform duration-500 ease-out transform ${
            selectedAirportCode || routeFlights.length > 0 ? 'translate-x-0' : 'translate-x-full'
          } w-80 bg-slate-900/85 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl pointer-events-auto`}
        >
          <RoutePanel 
            routeFlights={routeFlights} 
            onClear={handleClearRoute} 
            onRemoveFlight={handleRemoveFlight}
          />
          
          <FlightBoard 
            airportCode={selectedAirportCode} 
            airportName={selectedAirport ? selectedAirport.name : ''}
            destinationFilterCode={destinationFilterCode}
            onClose={() => {
              setSelectedAirportCode(null);
              setDestinationFilterCode(null);
            }} 
            onSelectFlight={handleSelectFlight}
          />
        </div>
      </div>
    </APIProvider>
  );
}
