import { AIRPORTS } from '../data/airports';

const ODPT_BASE_URL = 'https://api.odpt.org/api/v4';
const ACCESS_TOKEN = import.meta.env.VITE_ODPT_ACCESS_TOKEN;

/**
 * Fetch today's departing flights for a specific airport
 * @param {string} airportCode - IATA airport code (e.g., 'HND', 'ITM')
 * @returns {Promise<Array>} List of formatted flight objects
 */
export const fetchDepartingFlights = async (airportCode) => {
  if (!ACCESS_TOKEN) {
    console.error('ODPT API token is missing.');
    return [];
  }

  try {
    const departureUrl = `${ODPT_BASE_URL}/odpt:FlightInformationDeparture?odpt:operator=odpt.Operator:JAL&odpt:departureAirport=odpt.Airport:${airportCode}&acl:consumerKey=${ACCESS_TOKEN}`;
    const arrivalUrl = `${ODPT_BASE_URL}/odpt:FlightInformationArrival?odpt:operator=odpt.Operator:JAL&odpt:originAirport=odpt.Airport:${airportCode}&acl:consumerKey=${ACCESS_TOKEN}`;
    
    const [depResponse, arrResponse] = await Promise.all([
      fetch(departureUrl),
      fetch(arrivalUrl)
    ]);

    if (!depResponse.ok || !arrResponse.ok) {
      throw new Error(`Failed to fetch from ODPT API`);
    }

    const [depData, arrData] = await Promise.all([
      depResponse.json(),
      arrResponse.json()
    ]);

    const arrLookup = {};
    arrData.forEach(flight => {
      const fn = flight['odpt:flightNumber'] ? flight['odpt:flightNumber'][0] : null;
      if (fn) {
        arrLookup[fn] = flight['odpt:scheduledArrivalTime'];
      }
    });

    const flights = depData.map(flight => {
      let terminal = 'TBD';
      if (flight['odpt:departureAirportTerminal']) {
        const parts = flight['odpt:departureAirportTerminal'].split('.');
        terminal = parts[parts.length - 1].replace('Terminal', 'T');
      }

      let destinationCode = '';
      if (flight['odpt:destinationAirport']) {
        const parts = flight['odpt:destinationAirport'].split(':');
        destinationCode = parts[parts.length - 1];
      }

      const destAirport = AIRPORTS.find(a => a.code === destinationCode);
      const destinationName = destAirport ? destAirport.name : destinationCode;

      const flightNumber = flight['odpt:flightNumber'] ? flight['odpt:flightNumber'][0] : 'Unknown';

      // Parse status
      let statusRaw = flight['odpt:flightStatus'] ? flight['odpt:flightStatus'].split(':').pop() : 'OnTime';
      let status = '定刻';
      if (statusRaw === 'Delayed') status = '遅延';
      if (statusRaw === 'Cancelled') status = '欠航';
      if (statusRaw === 'NewTime') status = '時間変更';

      return {
        id: flight['@id'],
        flightNumber,
        destinationCode,
        destinationName,
        scheduledTime: flight['odpt:scheduledDepartureTime'], 
        scheduledArrivalTime: arrLookup[flightNumber],
        estimatedTime: flight['odpt:estimatedDepartureTime'], 
        actualTime: flight['odpt:actualDepartureTime'],
        terminal,
        gate: flight['odpt:departureGate'] || '-',
        status,
        statusRaw
      };
    });

    // Only show domestic flights that are in our AIRPORTS database
    const domesticFlights = flights.filter(f => AIRPORTS.some(a => a.code === f.destinationCode));

    // Sort by scheduled time
    return domesticFlights.sort((a, b) => {
      if (!a.scheduledTime || !b.scheduledTime) return 0;
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });

  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};
