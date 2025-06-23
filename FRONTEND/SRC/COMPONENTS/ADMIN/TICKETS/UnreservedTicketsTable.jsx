import React, { useLayoutEffect } from 'react'
import DataTable from 'datatables.net-bs5';
import 'datatables.net-fixedheader-bs5';
import '../../../styles/DataTable.css'
import { downloadTicket, shareTicket } from '../../../utils/ticketData';

const UnreservedTicketsTable = ({ unreservedTickets, allUsers }) => {

    useLayoutEffect(() => {
        let table = new DataTable('#unreservedTicketTable', {
            fixedHeader: true,
            responsive: true,
            autoWidth: true,
            paging: true,
            orderMulti: true,
            columnDefs: [
                { orderable: false, targets: [6, 4] }
            ],
        });

        return () => {
            table.destroy();
        }
    }, [])


    return (
        <>
            <section className="d-flex flex-column justify-content-between align-items-center mt-2 w-100">
                <h3>Unreserved Tickets</h3>

                <table id="unreservedTicketTable" className="table table-striped table-bordered w-100" style={{ "width": "100%" }}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Booked By</th>
                            <th scope="col">From</th>
                            <th scope="col">To</th>
                            <th scope="col">Passengers</th>
                            <th scope="col">Fare</th>
                            <th scope="col">Status</th>
                            <th scope="col">Booked At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            unreservedTickets.map((ticket, index) => {
                                console.log(ticket);
                                // calculate if the ticket has been expired
                                const expiryDate = new Date(ticket?.expiresAt);
                                const currentDate = new Date();
                                const isExpired = expiryDate < currentDate;
                                const status = isExpired ? "Expired" : "Active";
                                const statusColor = isExpired ? "danger" : "success";
                                const lastEditedAt = new Date(ticket?.issuedAt).toLocaleString();

                                return <tr key={ticket?._id}>
                                    <th title={`Ticket Id: ${ticket?._id}`} scope="row">{index + 1}</th>

                                    <td title={`User Id: ${ticket?.userId}`}>{allUsers[ticket?.userId] ?? "Unknown"}</td>
                                    {/* <td>{ticket?.userId}</td> */}

                                    <td>{ticket?.sourceStation?.name} ({ticket?.sourceStation?.code})</td>
                                    <td>{ticket?.destinationStation?.name} ({ticket?.destinationStation?.code})</td>
                                    <td>{ticket?.numberOfPassengers}</td>
                                    <td>{ticket?.fare} Rs.</td>
                                    <td>
                                        <span className={`badge bg-${statusColor}`}>{status}</span>
                                    </td>
                                    <td>{lastEditedAt}</td>

                                    <td>
                                        {/* Share button */}
                                        <button onClick={() => shareTicket(ticket.ticketData)} type="button" className="btn btn-primary me-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-share-fill" viewBox="0 0 16 16">
                                                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"></path>
                                            </svg>
                                        </button>

                                        {/* Download button */}
                                        <button onClick={() => downloadTicket(ticket.ticketData)} type="button" className="btn btn-success">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
                                            </svg>
                                        </button>

                                    </td>

                                </tr>
                            })
                        }
                    </tbody>
                </table>

            </section>

        </>
    )
}

export default UnreservedTicketsTable