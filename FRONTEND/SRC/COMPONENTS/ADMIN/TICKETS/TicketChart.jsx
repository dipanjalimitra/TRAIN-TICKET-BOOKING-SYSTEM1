import React, { useState, useEffect } from 'react';

import { Chart } from "react-google-charts";
import CONSTANTS from '../../../../CONSTANTS';
import { getAuthToken } from '../../../utils/localstorage';

const TicketChart = ({ reservedTickets, unreservedTickets }) => {
    const [ticketData, setTicketData] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [chartData, setChartData] = useState(null);


    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    useEffect(() => {
        if (unreservedTickets.length > 0)
            prepareChartData(unreservedTickets);
    }, [unreservedTickets]);

    // ---- Custom Functions ---- //

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
        return groupedTickets;
    };

    function prepareChartData(tickets) {
        const groupedTickets = groupTicketsByDay(tickets);
        const chartData = [['Day', 'Tickets']];
        for (const [key, value] of Object.entries(groupedTickets)) {
            chartData.push([key, value]);
        }
        console.log('Chart Data:', chartData);
        setChartData(chartData);
    };


    // ---- JSX ---- //
    return (
        <div>
            <h2>Tickets Booked Per Day</h2>
            <div style={{ height: '400px', width: '600px' }}>

                {
                    chartData &&
                    <Chart
                        chartType="LineChart"
                        data={chartData}
                        width="100%"
                        height="400px"
                        legendToggle={false}
                        loader={<div>Loading Chart</div>}
                    />
                }


                {/* <Chart
                    chartType="ScatterChart"
                    data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
                    width="100%"
                    height="400px"
                    legendToggle
                /> */}

            </div>
        </div>
    );
};

export default TicketChart;
