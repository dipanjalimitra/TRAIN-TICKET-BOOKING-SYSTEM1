import React, { useEffect, useState } from 'react'
import CONSTANTS from '../../../../CONSTANTS.js'
import { getAuthToken } from "../../../utils/localstorage.js"
import { toast } from 'react-toastify';
import { Chart } from "react-google-charts";


const TicketAnalytics = ({ reservedTickets, unreservedTickets }) => {
  const [totalReservedTicketFare, setTotalReservedTicketFare] = useState(0)
  const [totalUnreservedTicketFare, setTotalUnreservedTicketFare] = useState(0)
  const [unreservedChartData, setUnreservedChartData] = useState(null);
  const [reservedChartData, setReservedChartData] = useState(null);

  function groupTicketsByDay(tickets) {
    // console.log('Grouping Tickets by Day');
    // console.log(tickets);

    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const date = new Date(ticket.issuedAt).toDateString();
      if (groupedTickets[date]) {
        groupedTickets[date] += 1;
      } else {
        groupedTickets[date] = 1;
      }
    });
    console.log('Grouped Tickets:', groupedTickets);

    const chartData = [['Day', 'Tickets']];
    for (const [key, value] of Object.entries(groupedTickets)) {
      chartData.push([key, value]);
    }

    return chartData;

  };

  useEffect(() => {
    // Calculate total fare of reserved tickets
    let totalReservedFare = 0
    reservedTickets.forEach(ticket => {
      totalReservedFare += ticket.fare
    });
    setTotalReservedTicketFare(totalReservedFare)

    // Prepare Chart Data for Reserved Tickets
    const groupedReservedTickets = groupTicketsByDay(reservedTickets);
    setReservedChartData(groupedReservedTickets);

    // Calculate total fare of unreserved tickets
    let totalUnreservedFare = 0
    unreservedTickets.forEach(ticket => {
      totalUnreservedFare += ticket.fare
    })
    setTotalUnreservedTicketFare(totalUnreservedFare)

    // Prepare Chart Data for Unreserved Tickets
    const groupedUnreservedTickets = groupTicketsByDay(unreservedTickets);
    setUnreservedChartData(groupedUnreservedTickets);

  }, [reservedTickets, unreservedTickets])



  return (
    <>
      {/* Create a Card Element to show number of */}
      <div className="card my-3">
        <div className="card-header">
          <h4 className="card-title">Ticket Analytics</h4>
        </div>
        <div className="card-body">

          {/* Reserved and Unreserved Tickets */}
          <div className="row mb-2">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Reserved Tickets</h4>
                </div>
                <div className="card-body">
                  <p>Total Reserved Tickets: <b>{reservedTickets.length}</b></p>
                  <p>Total Amount: <b>{totalReservedTicketFare} Rs.</b></p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Unreserved Tickets</h4>
                </div>
                <div className="card-body">
                  <p>Total Unreserved Tickets: <b>{unreservedTickets.length}</b></p>
                  <p>Total Amount: <b>{totalUnreservedTicketFare} Rs.</b></p>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Chart */}
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Daywise Sell - Reserved Tickets</h4>
                </div>
                <div className="card-body">

                  {
                    reservedChartData &&
                    <Chart
                      chartType="ColumnChart"
                      data={reservedChartData}
                      width="100%"
                      height="auto"
                      legendToggle={false}
                      loader={<div>Loading Chart</div>}
                    />
                  }

                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Daywise Sell - Unreserved Tickets</h4>
                </div>
                <div className="card-body">

                  {
                    unreservedChartData &&
                    <Chart
                      chartType="ColumnChart"
                      data={unreservedChartData}
                      width="100%"
                      height="auto"
                      legendToggle={false}
                      loader={<div>Loading Chart</div>}
                    />
                  }

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}

export default TicketAnalytics