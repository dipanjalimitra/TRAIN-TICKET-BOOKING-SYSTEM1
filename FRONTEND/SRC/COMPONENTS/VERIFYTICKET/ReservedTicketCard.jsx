import React from 'react'

const fullGender = { "m": "Male", "f": "Female", "o": "Other" }
const fullBerthName = { "lb": "Lower Berth", "mb": "Middle Berth", "ub": "Upper Berth", "sl": "Side Lower", "su": "Side Upper" }

const ReserveTicketCard = ({ decodeResult }) => {
    let bookingTime = new Date(decodeResult.data.iat * 1000)
    let expiryTime = new Date(decodeResult.data.exp * 1000).toLocaleString();


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
                <p>Fare : {decodeResult?.data.fare} Rs.</p>

                {
                    decodeResult?.data.passengers.map((item, index) => (
                        <p className="fw-semibold" key={index}>Passenger {index + 1} : {item.name} ({item.age}, {fullGender[item.gender]}) - {fullBerthName[item.berth]}</p>
                    ))
                }

                <p>Booking Time : {bookingTime.toLocaleDateString()} {bookingTime.toLocaleTimeString()}</p>
                <p>Valid Till : {expiryTime}</p>
                <p className='fw-bold'>{decodeResult?.data.type} Ticket</p>
            </div>

        </div>
    )
}

export default ReserveTicketCard