import React from 'react';
import { AIRPORTS } from '../data/airports';

const RoutePanel = ({ routeFlights, onClear, onRemoveFlight }) => {
  if (!routeFlights || routeFlights.length === 0) return null;

  // Resolve the starting airport name
  const firstFlight = routeFlights[0];
  const firstAirport = AIRPORTS.find(a => a.code === firstFlight.from) || { name: firstFlight.from };

  return (
    <div className="p-4 shrink-0 pb-2 border-b border-slate-700/50 mb-2">
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
          <div key={index} className="relative flex items-start mb-4 group">
            <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 z-10"></div>
            <div className="ml-6 flex-1 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 relative">
              <button
                onClick={() => onRemoveFlight && onRemoveFlight(index)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="このフライトを削除"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex justify-between items-baseline mb-1 pr-6">
                <span className="text-[11px] text-slate-400 font-mono">{segment.flight.flightNumber}</span>
                <span className="text-xs font-semibold text-white">
                  {segment.flight.scheduledTime}
                  {segment.flight.scheduledArrivalTime && (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">- {segment.flight.scheduledArrivalTime}着</span>
                  )}
                  {!segment.flight.scheduledArrivalTime && '発'}
                </span>
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
