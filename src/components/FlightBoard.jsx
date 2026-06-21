import React, { useEffect, useState, useRef } from 'react';
import { fetchDepartingFlights } from '../api/odptApi';

const FlightBoard = ({ airportCode, airportName, onClose, onSelectFlight }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!airportCode) return;
    
    let isMounted = true;
    const loadFlights = async () => {
      setLoading(true);
      const data = await fetchDepartingFlights(airportCode);
      if (isMounted) {
        setFlights(data);
        setLoading(false);
        // Scroll to current time or top
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }
    };
    
    loadFlights();
    
    return () => { isMounted = false; };
  }, [airportCode]);

  return (
    <div 
      className={`fixed top-0 right-0 bottom-0 z-20 flex pointer-events-none transition-transform duration-500 ease-out transform ${
        airportCode ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="bg-slate-900/85 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl w-80 p-4 pointer-events-auto flex flex-col h-full">
        
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold tracking-wider text-white">{airportName} 出発</h2>
            {loading ? (
              <span className="text-[11px] text-slate-400 animate-pulse">更新中...</span>
            ) : (
              <span className="text-[11px] text-slate-400">本日のフライト (JAL)</span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full w-7 h-7 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2" ref={containerRef}>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : flights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>出発便情報がありません</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-2 px-1 font-medium">定刻</th>
                  <th className="py-2 px-1 font-medium">行先</th>
                  <th className="py-2 px-1 font-medium text-right">便名</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {flights.map((flight) => (
                  <tr 
                    key={flight.id} 
                    className="hover:bg-slate-800/80 transition-colors text-white group cursor-pointer"
                    onClick={() => onSelectFlight && onSelectFlight(flight)}
                  >
                    <td className="py-2.5 px-1 text-base font-semibold tracking-tight group-hover:text-emerald-400 transition-colors">{flight.scheduledTime}</td>
                    <td className="py-2.5 px-1 font-medium text-sm">{flight.destinationName}</td>
                    <td className="py-2.5 px-1 text-slate-300 font-mono text-xs text-right">{flight.flightNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBoard;
