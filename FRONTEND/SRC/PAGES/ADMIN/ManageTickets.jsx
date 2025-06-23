import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from '../../components/Navbar/MasterNavbar'
import CONSTANTS from '../../../CONSTANTS';
import { getAuthToken } from '../../utils/localstorage';
import ReservedTicketsTable from '../../components/Admin/Tickets/ReservedTicketsTable';
import UnreservedTicketsTable from '../../components/Admin/Tickets/UnreservedTicketsTable';

const ManageTickets = () => {
    // --- State Variables --- //
    const [reservedTickets, setReservedTickets] = useState([])
    const [unreservedTickets, setUnreservedTickets] = useState([])
    const [allUsers, setAllUsers] = useState([{}])
    const [hasFetched, setHasFetched] = useState(false)

    // --- Custom Functions --- //
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
            setReservedTickets(data.reservedTickets.reverse())
            setUnreservedTickets(data.unreservedTickets.reverse())
            setAllUsers(data.allUsers)

        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch tickets")
        }
    }


    // --- Side Effects --- //
    useEffect(() => {
        if (!hasFetched) {
            fetchTickets();
            setHasFetched(true);
        }
    }, [hasFetched]);


    // --- JSX --- //
    return (
        <>
            <Navbar />
            <ToastContainer position='top-left' theme='dark' />

            {/*  <AddStationModal /> */}

            <div className="container my-3">
                <section className="d-flex  justify-content-between align-items-center">
                    <h1>All tickets</h1>

                    <div >
                        {/* <button type="button" className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                            Add Ticket
                        </button> */}
                        <button onClick={fetchTickets} type="button" className="btn btn-warning">
                            Get All Tickets
                        </button>
                    </div>
                </section>

                {
                    (unreservedTickets.length > 0) &&
                    <UnreservedTicketsTable unreservedTickets={unreservedTickets} allUsers={allUsers} />
                }

                <hr />

                {
                    (reservedTickets.length > 0) &&
                    <ReservedTicketsTable reservedTickets={reservedTickets} allUsers={allUsers} />
                }


            </div >
        </>
    )
}

export default ManageTickets