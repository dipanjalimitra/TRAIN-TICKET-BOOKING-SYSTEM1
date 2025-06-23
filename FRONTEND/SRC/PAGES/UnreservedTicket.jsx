"use client";

import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from '../components/Navbar/MasterNavbar';
import { addNewTicket, getAuthToken } from '../utils/localstorage';
import CONSTANTS from '../../CONSTANTS';
import NewRegularTicketCard from '../components/NewTicketCard';
import calculateDistance from '../utils/distanceCalculator';
import { isLoggedIn } from '../utils/authentication';
import { useNavigate } from 'react-router-dom';


const UnreservedTicket = () => {

    // ---- State Variables ---- //
    const [ticket, setTicket] = useState({ source: "null", destination: "null", ticketData: null, encryptedTicketData: null, noOfPassenger: 1, distance: 0, farePerPassenger: 0 })
    const [ticketCardData, setTicketCardData] = useState({ encryptedTicketData: null, ticketData: null, id: null })
    const [allStations, setAllStations] = useState([])
    const [hasFetched, setHasFetched] = useState(false)
    const [showTicketCard, setShowTicketCard] = useState(false)


    // ---- Ref variables ---- //
    const sourceInputRef = useRef(null)
    const destinationInputRef = useRef(null)
    const ticketCardDataRef = useRef({ encryptedTicketData: null, ticketData: null, id: null })


    const navigate = useNavigate();


    // ---- Custom Functions ---- //

    function getAllStations() {
        if (allStations.length > 0) return;
        // const URL = `${window.location.protocol}//${window.location.host}/data/ALL_STATIONS.json`
        const URL = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.getAllStations}`
        console.log(URL)

        fetch(URL).then(res => res.json()).then((_rawData) => {
            const jsonData = JSON.stringify(_rawData)
            const parsedData = JSON.parse(jsonData);

            setAllStations(parsedData.data)

            console.log(parsedData.data)
        })
    }

    function changeStation(e) {
        const value = e.target.value;
        const name = e.target.name;

        setTicket((oldData) => {
            return {
                ...oldData,
                [name]: value
            }
        })

        if ((name == "source" || name == "destination") && value == "null") {
            setTicketCardData({ encryptedTicketData: null, ticketData: null, id: null })
        }
    }

    function changePassenger(changeBy) {
        // Number of passenger can't be lower than 1
        if (ticket.noOfPassenger == 1 && changeBy < 1) return;

        // Number of passenger can't be lower than 100
        if (ticket.noOfPassenger == 100 && changeBy > 0) return;


        setTicket((oldData) => {
            return {
                ...oldData,
                "noOfPassenger": (oldData.noOfPassenger + changeBy)
            }
        })
    }

    async function bookTicket() {
        console.log("Booking ticket...")

        if (isLoggedIn() == false) {
            toast.error("Please login to book ticket")
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        if (ticket.source === "null" || ticket.destination === "null") return;
        console.log(ticket);


        if (ticket.source == ticket.destination) {
            toast.error("Source and Destination stations can't be same")
            return;
        }

        const sourceStation = allStations.filter((item) => (item.code == ticket.source))[0];
        const destinationStation = allStations.filter((item) => (item.code == ticket.destination))[0];

        const distance = calculateDistance(sourceStation.lat, sourceStation.long, destinationStation.lat, destinationStation.long);
        const fare = Math.round(distance * CONSTANTS.UnreservedTicketFarePerKm * ticket.noOfPassenger);

        const ticketData = {
            sourceStationName: sourceStation.name,
            sourceStationCode: sourceStation.code,
            destinationStationName: destinationStation.name,
            destinationStationCode: destinationStation.code,
            numberOfPassenger: ticket.noOfPassenger,
            distance,
            fare,
            AUTH_TOKEN: getAuthToken()
        };

        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.createRegularTicket}`;
        const params = { body: JSON.stringify(ticketData), method: 'POST', headers: { 'Content-Type': 'application/json' } };

        try {
            const response = await fetch(API, params).then(res => res.json())

            if (response.status == "error") {

                if (response.type == "unauthorized") {
                    toast.error("Please login to book ticket");

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
                toast.error(response.msg)

                return;
            }

            toast.success("Ticket Booked Successfully")
            console.log(response);

            setTicketCardData({ encryptedTicketData: response.data, ticketData: ticketData, id: response.id })

            ticketCardDataRef.current = { encryptedTicketData: response.data, ticketData: ticketData, id: response.id }

            setShowTicketCard(true)

            addNewTicket(response.data);

            resetFields();
        } catch (error) {
            console.error(error)
            toast.error("Failed to book ticket")
        }

    }

    function resetFields() {
        sourceInputRef.current.value = null
        destinationInputRef.current.value = null;

        setTicket((oldValues) => {
            return {
                ...oldValues,
                source: "null",
                destination: "null",
                noOfPassenger: 1
            }
        })
    }


    // ---- Hoocks ---- ///

    useEffect(() => {
        // setAllStations(ALL_STATIONS)
        console.log("Running UseEffect in UnreservedTicket.jsx")
        if (allStations.length <= 0) {
            getAllStations();
            setHasFetched(true)
        }

        return () => {
            console.log("Unmounting UnreservedTicket.jsx")
        }

    }, []);


    // ---- JSX ---- //

    return (
        <>
            <ToastContainer position='top-left' theme="dark" />

            <Navbar />
            <div className='container my-3'>
                <h1>Book Regular Tickets</h1>

                <div className='my-3'>
                    {/* Source Stations Dropdown */}
                    <div className="mb-3">
                        <label className="form-label fs-5" htmlFor="sourceInput">Source Station</label>
                        <select ref={sourceInputRef} onChange={changeStation} value={ticket.source} name="source" className="form-select" id="sourceInput">
                            {
                                (allStations.length <= 0) ?
                                    <option value="null" disabled>No Station Found</option>
                                    :
                                    <option value="null" selected disabled>Select Station</option>
                            }

                            {
                                allStations.map((item) => {
                                    return <option key={item.code} value={item.code}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>

                    {/* Destination Stations Dropdown */}
                    <div className="mb-3">
                        <label className="form-label fs-5" htmlFor="destInput">Destination Station</label>
                        <select ref={destinationInputRef} value={ticket.destination} onChange={changeStation} name="destination" className="form-select" id="destInput">
                            {
                                (allStations.length <= 0) ?
                                    <option value="null" disabled>No Station Found</option>
                                    :
                                    <option value="null" selected disabled>Select Station</option>
                            }

                            {
                                allStations.map((item) => {
                                    return <option key={item.code} value={item.code}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>

                    {/* Change Number of Passenger */}
                    <div className="mb-3">
                        <label className='form-label fs-5' htmlFor="numberOfPassengerSelect">Number of Passenger</label>
                        <div className='d-flex gap-3 align-items-center' id='numberOfPassengerSelect'>
                            <button onClick={() => changePassenger(-1)} className='btn btn-danger fw-bold'>-</button>
                            <span className='fs-5 fw-bold'>{ticket.noOfPassenger}</span>
                            <button onClick={() => changePassenger(1)} className='btn btn-primary fw-bold'>+</button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button onClick={bookTicket} className='btn btn-success w-100'>Book Ticket</button>
                </div> { /* Form End */}


                {/* Verbose the ticket State      // DEVELOPMENT  */}
                <div className='d-none'>
                    <h4>Details (verbose)</h4>
                    <p>Source : {ticket.source}</p>
                    <p>Destination : {ticket.destination}</p>
                    <p>Number of Passenger : {ticket.noOfPassenger} </p>
                    <p>Ticket Data : {ticket.encryptedTicketData} </p>
                </div>

                <hr />

                {
                    (ticketCardData.encryptedTicketData) &&
                    <NewRegularTicketCard
                        ticketData={ticketCardData.encryptedTicketData}
                        id={ticketCardData.id}
                        key={ticketCardData.id}
                    />
                }

            </div>
        </>
    )
}


export default UnreservedTicket