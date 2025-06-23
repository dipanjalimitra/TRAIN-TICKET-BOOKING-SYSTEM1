// create a context for managing stations
//
// Path: frontend/context/Admin/manageStations.js

import React, { createContext, useState } from 'react'

const ManageStationsContext = createContext()

const ManageStationsProvider = ({ children }) => {
    const [allStations, setAllStations] = useState([]);
    const [currentStation, setCurrentStation] = useState({ name: "", code: "", action: "add" });

    return (
        <ManageStationsContext.Provider
            value={{ allStations, setAllStations, currentStation, setCurrentStation }}
        >
            {children}
        </ManageStationsContext.Provider>
    )
}

export { ManageStationsProvider, ManageStationsContext }
