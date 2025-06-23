// create a context for all stations

import React, { createContext, useState } from 'react'
import CONSTANTS from '../CONSTANTS';

const AllStationsContext = createContext();


const AllStationsProvider = ({ children }) => {
    const [allStations, setAllStations] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);

    async function fetchAllStations() {
        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.getAllStations}`

        try {
            const response = await fetch(API).then(res => res.json());
            setAllStations(response.data);
            setHasFetched(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AllStationsContext.Provider
            value={{ allStations, setAllStations }}
        >
            {children}
        </AllStationsContext.Provider>
    )
}

export { AllStationsProvider, AllStationsContext }
