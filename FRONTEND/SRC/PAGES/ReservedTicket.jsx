"use client";

import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar/MasterNavbar'
import CONSTANTS from '../../CONSTANTS';
import PassengerDetailsBox from '../components/ReservedTicket/PassengerDetailsBox';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import { addNewTicket, getAuthToken } from '../utils/localstorage';
import ReservedTicketCard from '../components/ReservedTicket/ReservedTicketCard';
import { isLoggedIn } from '../utils/authentication';
import { useNavigate } from 'react-router-dom';
import calculateDistance from '../utils/distanceCalculator';

const ReservedTicket = () => {

    // ---- State Variables ---- //
    const [ticketDetails, setTicketDetails] = useState({ ticketId: null, destination: null, source: null, ticketData: null, encryptedTicketData: null, noOfPassenger: 1 });
    const [allStations, setAllStations] = useState([]);
    const [ticket, setTicket] = useState({ source: null, destination: null, ticketData: null, encryptedTicketData: null, noOfPassenger: 1 })


    // ---- Refs ---- //
    const destinationInputRef = useRef(null);


    // ---- Variables ---- //
    const navigate = useNavigate();



    // ---- Custom Functions ---- //

    function getAllStations() {
        if (allStations.length > 0) return;
        // const URL = `${window.location.protocol}//${window.location.host}/data/ALL_STATIONS.json`
        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.getAllStations}`

        fetch(API).then(res => res.json()).then((_rawData) => {
            const jsonData = JSON.stringify(_rawData)
            const parsedData = JSON.parse(jsonData);

            setAllStations(parsedData.data)
        }).catch((err) => {
            toast.error("Failed to get stations")
            console.error(err)
        })
    }

    function increasePassenger() {
        if (ticket.noOfPassenger >= 20) {
            toast.info("Maximum 20 Passengers are allowed", { autoClose: 2500 })
            return;
        }

        setTicket((oldData) => {
            return {
                ...oldData,
                noOfPassenger: oldData.noOfPassenger + 1
            }
        })
    }

    function decreasePassenger() {
        if (ticket.noOfPassenger == 1) {
            toast.warning("Minimum 1 Passenger is required", { autoClose: 2500 })
            return;
        }

        setTicket((oldData) => {
            return {
                ...oldData,
                noOfPassenger: oldData.noOfPassenger - 1
            }
        })
    }


    const handleChange = (e) => {
        console.log(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoggedIn() == false) {
            toast.error("Please login to book ticket")
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            return;
        }

        console.log(ticket)

        if (ticket.source == null || ticket.destination == null) {
            toast.error("Please select source and destination stations")
            return;
        }

        const sourceStation = allStations.filter((item) => (item.code == ticket.source))[0];
        const destinationStation = allStations.filter((item) => (item.code == ticket.destination))[0];
        console.log(sourceStation, destinationStation);


        let distance = calculateDistance(sourceStation.lat, sourceStation.long, destinationStation.lat, destinationStation.long)
        distance = distance.toFixed(2); // upto 2 decimal places
        const fare = Math.round(distance * CONSTANTS.UnreservedTicketFarePerKm * ticket.noOfPassenger);

        const allPassenger = getAllPassengerDetails();

        if (allPassenger.length != ticket.noOfPassenger || allPassenger.length <= 0) return;

        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.createReservedTicket}`;
        const body = {
            sourceStationName: sourceStation.name,
            sourceStationCode: sourceStation.code,
            destinationStationName: destinationStation.name,
            destinationStationCode: destinationStation.code,
            numberOfPassenger: ticket.noOfPassenger,
            passengers: allPassenger,
            distance,
            fare,
            AUTH_TOKEN: getAuthToken(),
        }

        const params = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        try {
            const response = await fetch(API, params).then(res => res.json());

            console.log("-".repeat(50));
            console.log("Response : ")
            console.log(response)
            console.log("-".repeat(50));

            if (response.status == "error") {
                toast.error(response.message)
                return;
            }

            toast.success("Ticket Booked Successfully");

            setTicket((oldData) => {
                return {
                    ...oldData,
                    encryptedTicketData: response.data
                }
            });

            console.log(ticket)

            addNewTicket(response.data); // add ticket data to localstorage

        } catch (error) {
            console.error(error)
            toast.error("Failed to book ticket")
            return;
        }
    }

    const getAllPassengerDetails = () => {
        const passengerDetails = [];
        for (let i = 0; i < ticket.noOfPassenger; i++) {
            const name = document.getElementById(`name-${i}`).value.trim();
            const age = document.getElementById(`age-${i}`).value.trim();
            const gender = document.getElementById(`gender-${i}`).value.trim();
            const berth = document.getElementById(`berth-${i}`).value.trim();

            if (name == "" || age == "" || gender == false || berth == false) {
                toast.error("Please fill all the details for passenger " + (i + 1))
                return;
            }

            passengerDetails.push({ name, age, gender, berth });
        }

        return passengerDetails;
    }

    const changeStation = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setTicket((oldData) => {
            return {
                ...oldData,
                [name]: value
            }
        })
    }

    function resetFields() {
        const destinationInput = destinationInputRef.current;
        destinationInput.value = false;

        setTicket((oldValues) => {
            return {
                ...oldValues,
                source: null,
                destination: null,
                noOfPassenger: 1
            }
        });


    }

    // ---- Lifecycle Hooks ---- //
    useEffect(() => {
        getAllStations()
    }, [])


    // ----- JSX ----- //
    return (
        <>
            <Navbar />
            <ToastContainer position='top-left' theme='dark' />

            <div className="container my-3">
                <h1>Book Reserved Tickets</h1>

                {/* Stations Selection Box */}
                <div className="d-flex flex-row gap-2 flex-wrap justify-content-between align-items-center">

                    {/* Source Station Dropdown */}
                    <div className="mb-3 flex-grow-1">
                        <label className="form-label fs-5" htmlFor="srcInput">From Station</label>
                        <select onChange={changeStation} name="source" className="form-select" id="srcInput">
                            {
                                (allStations.length <= 0) ?
                                    <option value={null} disabled>No Station Found</option>
                                    :
                                    <option value={null} disabled>Select Station</option>
                            }

                            {
                                allStations.map((item, index) => {
                                    return <option key={item.code} value={item.code}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>

                    {/* Destination Station Dropdown */}
                    <div className="mb-3 flex-grow-1">
                        <label className="form-label fs-5" htmlFor="destInput">To Station</label>
                        <select ref={destinationInputRef} onChange={changeStation} name="destination" className="form-select" id="destInput">
                            {
                                (allStations.length <= 0) ?
                                    <option value={null} disabled>No Station Found</option>
                                    :
                                    <option value={null} selected disabled>Select Station</option>
                            }

                            {
                                allStations.map((item, index) => {
                                    return <option key={item.code} value={item.code}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>

                </div>

                {/* Add Passenger Button */}
                <div className="mb-3 d-flex flex-row flex-wrap justify-content-start gap-2">
                    <button onClick={increasePassenger} className="btn btn-primary">Add Passenger</button>
                    <button onClick={decreasePassenger} className="btn btn-danger">Delete Last Passenger</button>
                </div>

                {/* Number of Passenger */}
                <PassengerDetailsBox numberOfPassenger={ticket.noOfPassenger} />

                {/* Submit Button */}
                <div className="mb-3">
                    <button onClick={handleSubmit} className="btn btn-success w-100">Book Ticket</button>
                </div>

                <hr />

                {
                    (ticket.encryptedTicketData) &&
                    <ReservedTicketCard
                        ticketData={ticket.encryptedTicketData}
                        key={ticket.encryptedTicketData}
                    />
                }

            </div>
        </>
    )
}

export default ReservedTicket