import getEnvironment from "./src/utils/environment.js"

const CONSTANTS = {
    "JWT_SECRET": "wfr43Ge5$2w*d9",
    "ALL_TICKETS_KEY": "allTickets",
    "AUTH_TOKEN_KEY": "AUTH_TOKEN",
    "addNewStationModalId": "addNewStationModal",
    "API": {
        "REMOTE_BASE_URL": "https://ticket-booking-system-4hmm.onrender.com/",
        "LOCAL_BASE_URL": `${window.location.protocol}//${window.location.hostname}:3000`,

        "BASE_URL": `${getEnvironment() === "development" ?
            `${window.location.protocol}//${window.location.hostname}:8000` :
            "https://ticket-booking-system-4hmm.onrender.com"}`,

        "addNewStation": "/add-station",
        "getAllStations": "/stations",
        "createRegularTicket": "/regular-ticket",
        "createReservedTicket": "/reserved-ticket",
        "verifyTicket": "/verify-ticket",
        "createUser": "/create-user",
        "loginUser": "/login",
        "getUserTickets": "/my-tickets",
        "adminApis": {
            "getAllTickets": "/admin/all-tickets",
        },
    },
    "UnreservedTicketFarePerKm": 0.5,
    "ReservedTicketFarePerKm": 1.5,
}

export default CONSTANTS