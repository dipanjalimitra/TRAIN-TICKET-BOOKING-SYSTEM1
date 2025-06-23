import React, { createRef, useRef } from 'react'
import { downloadTicket, shareTicket } from '../utils/ticketData';

const fullGender = { "m": "Male", "f": "Female", "o": "Others" };
const fullBerth = { "lb": "Lower Berth", "mb": "Middle Berth", "ub": "Upper Berth", "sl": "Side Lower Berth", "su": "Side Upper Berth" }

const ReservedTicketAccordionItem = ({ ticket, index }) => {
    console.log(ticket);

    let issueTime = "";
    if (ticket != undefined)
        issueTime = new Date(ticket?.issuedAt).toString();

    let dateTime;
    if (ticket != undefined)
        dateTime = new Date(ticket?.expiresAt);
    let expiryDate = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;


    return (
        <div className="accordion-item">
            <div className="accordion-header">
                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#rTicketCard${index}`} aria-expanded="true" aria-controls={`rTicketCard${index}`}>
                    {ticket?.sourceStation.name} ({ticket?.sourceStation.code}) - {ticket?.destinationStation.name} ({ticket?.destinationStation.code})
                </button>

                <small>Booked on : {issueTime}</small>
            </div>

            <div id={`rTicketCard${index}`} className="accordion-collapse collapse" data-bs-parent="#reservedTicketAccordion">
                <div className="accordion-body py-2">
                    <p className='my-0'>Id : <strong>{ticket?._id}</strong></p>
                    <p className='my-0'>From : <strong>{ticket?.sourceStation.name} ({ticket?.sourceStation.code})</strong></p>
                    <p className='my-0'>To :  <strong>{ticket?.destinationStation.name} ({ticket?.destinationStation.code})</strong></p>
                    <p className='my-0'>Passengers :</p>
                    <div>
                        {
                            ticket.passengers.map((item, index) => {
                                return (<p className='m-0'>
                                    <b>{index + 1}.</b>&nbsp;
                                    {item.name} ({item.gender}, {item.age} yr)
                                    &nbsp;- {fullBerth[item.berth]}
                                </p>)
                            })
                        }
                    </div>
                    <p className='my-0 mt-1'>Fare : <strong>{ticket?.fare} Rs.</strong></p>
                    <p className='my-0'>Valid Till : <strong>{expiryDate}</strong></p>

                    <div className="optionsBox d-flex flex-row w-100 align-items-center justify-content-evenly py-2">
                        <button onClick={() => shareTicket(ticket.ticketData)} type="button" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-share-fill" viewBox="0 0 16 16">
                                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"></path>
                            </svg>
                            <span className='ms-2'>Share</span>
                        </button>

                        <button onClick={() => downloadTicket(ticket.ticketData)} type="button" className="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
                            </svg>
                            <span className='ms-2'>Download</span>
                        </button>

                    </div>

                    <p className='my-0 text-muted'>Generated at: {issueTime}</p>
                </div>
            </div>

        </div>
    )
}

export default ReservedTicketAccordionItem