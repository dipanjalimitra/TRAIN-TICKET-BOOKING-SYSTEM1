import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/MasterNavbar.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TicketAnalytics from '../../components/Admin/Tickets/TicketAnalytics.jsx'
import CONSTANTS from '../../../CONSTANTS.js'
import { getAuthToken } from '../../utils/localstorage.js'
import TicketsLineChart from '../../components/Admin/Tickets/TicketChart.jsx'

const TicketsAnalytics = () => {

    // ---- State Variables ---- //
    const [reservedTickets, setReservedTickets] = useState([])
    const [unreservedTickets, setUnreservedTickets] = useState([])
    const [hasFetched, setHasFetched] = useState(false)


    // ---- Custom Functions ---- //

    async function fetchTickets() {
        try {
            const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.adminApis.getAllTickets}`;
            const body = { AUTH_TOKEN: getAuthToken() };
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === "error") {
                toast.warn(data.msg)
                return;
            }

            // Do something with the data
            setReservedTickets(data.reservedTickets)
            setUnreservedTickets(data.unreservedTickets)

        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch tickets")
        }
    }


    // ---- Side Effects ---- //
    useEffect(() => {
        if (!hasFetched) {
            fetchTickets();
            setHasFetched(true)

            // eslint-disable-next-line
        }
    }, [hasFetched])



    // ---- JSX ---- //

    return (<>
        <Navbar />
        <ToastContainer position="top-left" theme="dark" />

        <main className="container my-3">
            <button onClick={fetchTickets} className="btn btn-primary">Fetch Tickets</button>
            <TicketAnalytics reservedTickets={reservedTickets} unreservedTickets={unreservedTickets} />
           
            {/* <TicketsLineChart reservedTickets={reservedTickets} unreservedTickets={unreservedTickets} /> */}

        </main>

    </>)
}

export default TicketsAnalytics