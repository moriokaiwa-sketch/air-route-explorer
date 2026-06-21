import React from 'react';
import { AIRPORTS } from '../data/airports';

const RoutePanel = ({ routeFlights, onClear }) => {
  if (!routeFlights || routeFlights.length === 0) return null;

  // Resolve the starting airport name
  const firstFlight = routeFlights[0];
  const firstAirport = AIRPORTS.find(a => a.code === firstFlight.from) || { name: firstFlight.from };

  return (
    <div className="fixed top-4 right-4 z-30 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 pointer-events-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold tracking-wider text-white">選択ルート</h2>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
        >
          クリア
        </button>
      </div>

      <div className="relative pl-3">
        {/* Vertical line connecting the timeline dots */}
        <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-700"></div>

        {/* Start Point */}
        <div className="relative flex items-start mb-4 group">
          <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900 z-10"></div>
          <div className="ml-6 flex-1">
            <div className="text-sm font-bold text-slate-200">{firstAirport.name}</div>
          </div>
        </div>

        {/* Flights */}
        {routeFlights.map((segment, index) => (
          <div key={index} className="relative flex items-start mb-4">
            <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 z-10"></div>
            <div className="ml-6 flex-1 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] text-slate-400 font-mono">{segment.flight.flightNumber}</span>
                <span className="text-xs font-semibold text-white">{segment.flight.scheduledTime}発</span>
              </div>
              <div className="text-sm font-bold text-slate-200">{segment.flight.destinationName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutePanel;
