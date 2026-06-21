import React, { useEffect, useState, useRef } from 'react';
import { fetchDepartingFlights } from '../api/odptApi';

const FlightBoard = ({ airportCode, airportName, onClose }) => {
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
      className={`fixed bottom-0 left-0 right-0 z-20 flex justify-center pb-6 px-4 pointer-events-none transition-all duration-500 ease-out transform ${
        airportCode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-4xl p-6 pointer-events-auto flex flex-col max-h-[45vh]">
        
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-wider text-white">{airportName} 出発便案内</h2>
            {loading ? (
              <span className="text-xs text-slate-400 animate-pulse">更新中...</span>
            ) : (
              <span className="text-xs text-slate-400">本日のフライト (JAL)</span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
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
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="py-3 px-3 font-medium">定刻</th>
                  <th className="py-3 px-3 font-medium">変更</th>
                  <th className="py-3 px-3 font-medium">行先</th>
                  <th className="py-3 px-3 font-medium">便名</th>
                  <th className="py-3 px-3 font-medium">搭乗口</th>
                  <th className="py-3 px-3 font-medium">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-slate-800/50 transition-colors text-white group">
                    <td className="py-3 px-3 text-lg font-semibold tracking-tight">{flight.scheduledTime}</td>
                    <td className="py-3 px-3 text-red-400 font-bold tracking-tight">{flight.estimatedTime || ''}</td>
                    <td className="py-3 px-3 font-medium text-base">{flight.destinationName}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-sm">{flight.flightNumber}</td>
                    <td className="py-3 px-3">
                      {flight.gate !== '-' ? (
                        <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded text-xs font-mono">{flight.gate}</span>
                      ) : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                        flight.statusRaw === 'Delayed' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        flight.statusRaw === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {flight.status}
                      </span>
                    </td>
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
