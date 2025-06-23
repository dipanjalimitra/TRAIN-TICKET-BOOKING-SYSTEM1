import React from 'react'
import UnreservedTicketCard from './UnreservedTicketCard'
import ReservedTicketCard from './ReservedTicketCard'

const TicketResultBox = ({ decodedResult }) => {
  return (
    <>
      {
        decodedResult.status === "error" &&
        <div className="alert alert-danger" role="alert">
          {decodedResult.message}
        </div>
      }

      {
        decodedResult.status === "success" &&
        <>
          {
            decodedResult.data.type === "Unreserved" &&
            <UnreservedTicketCard decodeResult={decodedResult} />
          }

          {
            (decodedResult.data.type === "Reserved") &&
            <ReservedTicketCard decodeResult={decodedResult} />
          }
        </>
      }



    </>
  )
}

export default TicketResultBox