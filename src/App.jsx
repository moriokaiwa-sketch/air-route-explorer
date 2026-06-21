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
  const [panelHeight, setPanelHeight] = useState(40); // default height in vh
  const dragRef = React.useRef(null);

  const isPanelOpen = selectedAirportCode || routeFlights.length > 0;

  React.useEffect(() => {
    if (!isPanelOpen) {
      setPanelHeight(40);
    }
  }, [isPanelOpen]);

  const selectedAirport = AIRPORTS.find(a => a.code === selectedAirportCode);

  const handlePointerDown = (e) => {
    if (window.innerWidth >= 768) return; // Only drag on mobile
    e.target.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startHeight: panelHeight };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const deltaY = e.clientY - dragRef.current.startY;
    const deltaVh = (deltaY / window.innerHeight) * 100;
    let newHeight = dragRef.current.startHeight - deltaVh;
    newHeight = Math.max(20, Math.min(newHeight, 85)); // clamp between 20vh and 85vh
    setPanelHeight(newHeight);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    e.target.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

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
        
        {/* Right Sidebar / Bottom Sheet containing Route Panel and Flight Board */}
        <div 
          className={`fixed z-20 flex flex-col pointer-events-none transition-transform duration-500 ease-out transform
            bottom-0 left-0 right-0 w-full h-[var(--mobile-height)] border-t border-slate-700/50 rounded-t-2xl
            md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-80 md:!h-full md:border-t-0 md:border-l md:rounded-none
            ${selectedAirportCode || routeFlights.length > 0 
              ? 'translate-y-0 md:translate-y-0 md:translate-x-0' 
              : 'translate-y-full md:translate-y-0 md:translate-x-full'
            } bg-slate-900/85 backdrop-blur-xl shadow-2xl pointer-events-auto`}
          style={{ '--mobile-height': `${panelHeight}vh` }}
        >
          {/* Drag Handle for mobile */}
          <div 
            className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing md:hidden shrink-0 touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
          </div>

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
