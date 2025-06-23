import React from 'react'

const UnreservedTicketCard = ({ decodeResult }) => {

    let date = "";
    if (decodeResult?.data.exp) {
        date = new Date(decodeResult.data.exp * 1000).toLocaleDateString() + " " + new Date(decodeResult.data.exp * 1000).toLocaleTimeString();
    }

    return (
        <div className='card my-2'>
            <div className='card-header'>
                <span>Ticket Data</span>
                {
                    decodeResult.status === "success" ?
                        <span className="badge text-bg-success ms-2">Valid Ticket</span>
                        :
                        <span className="badge text-bg-danger ms-2">Invalid Ticket</span>
                }

            </div>
            <div className='card-body'>
                <p>From : {decodeResult?.data.sourceStationName} ({decodeResult.data.sourceStationCode})</p>
                <p>To : {decodeResult?.data.destinationStationName} ({decodeResult.data.destinationStationCode})</p>
                <p>Number of Passengers : {decodeResult?.data.numberOfPassenger}</p>
                <p>Fare : {decodeResult?.data.fare} Rs.</p>
                <p>Valid Till : {date}</p>
                <p className='fw-bold'>{decodeResult?.data.type} Ticket</p>
            </div>

        </div>
    )
}

export default UnreservedTicketCard