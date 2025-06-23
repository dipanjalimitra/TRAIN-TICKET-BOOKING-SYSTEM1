"use client";

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/MasterNavbar';
import { getAuthToken } from '../utils/localstorage';
import RegularTicketAccordionItem from './TicketAccordionItem';
import CONSTANTS from '../../CONSTANTS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReservedTicketAccordionItem from '../components/ReservedTicketAccordionItem';

const AllTickets = () => {
  const [unreservedTickets, setUnreservedTickets] = useState([])
  const [reservedTickets, setReservedTickets] = useState([])
  const [firstRender, setFirstRender] = useState(true)

  async function fetchUserTickets() {
    console.log("Fetching user tickets...")

    const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.getUserTickets}`;

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          AUTH_TOKEN: getAuthToken()
        })
      });

      const data = await response.json();
      console.log(data);

      // If error
      if (data.status === "error") {

        if (data.type === "unauthorized") {
          toast.error("Please login to view your tickets");

        }
        else
          toast.error(data.msg);

        console.log(data);
        return
      }

      // If success
      if (data.status === "success") {

        // filter out expired tickets
        let currentDate = new Date();
        let unreservedTickets = data.unreservedTickets.filter((item) => {
          let expiryDate = new Date(item.expiresAt);
          return expiryDate >= currentDate;
        });

        setUnreservedTickets(unreservedTickets.reverse());

        // set reserved tickets
        currentDate = new Date();
        let reservedTickets = data.reservedTickets.filter((item) => {
          let expiryDate = new Date(item.expiresAt);
          return expiryDate >= currentDate;
        });

        setReservedTickets(reservedTickets.reverse());

      }



    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch user tickets");
    }

  }

  useEffect(() => {
    console.log("Mounting AllTickets.jsx");

    if (firstRender) {
      fetchUserTickets();
      setFirstRender(false);
    }

    return () => {
      console.log("Unmounting AllTickets.jsx");
      setReservedTickets([]);
      setUnreservedTickets([]);
    }
  }, [])


  return (
    <>
      <Navbar />
      <ToastContainer position="top-left" theme="dark" />
      <main className='container my-3'>
        <h1>Your Tickets</h1>

        <div className="my-2">
          <button onClick={fetchUserTickets} className="btn btn-warning">Fetch All Tickets</button>
        </div>
        <hr />


        <section>
          <h3 className='mt-3'>Unreserved Tickets :</h3>
          <div className="accordion" id="accordionExample">
            {
              unreservedTickets.length === 0 &&
              <div className="alert alert-warning" role="alert">
                No unreserved tickets found
              </div>
            }
            {
              (unreservedTickets.length !== 0) &&
              unreservedTickets.map((item, index) => {
                return <RegularTicketAccordionItem key={index} ticket={item} index={index} />
              })
            }
          </div>
          <hr />
        </section>

        <section>
          <h3 className='mt-3'>Reserved Tickets :</h3>
          <div className="accordion" id="reservedTicketAccordion">
            {
              reservedTickets.length === 0 &&
              <div className="alert alert-warning" role="alert">
                No reserved tickets found
              </div>
            }
            {
              (reservedTickets.length !== 0) &&
              reservedTickets.map((item, index) => {
                return <ReservedTicketAccordionItem key={index} ticket={item} index={index} />
              })
            }
          </div>
          <hr />
        </section>



      </main>
    </>
  )

}


export default AllTickets