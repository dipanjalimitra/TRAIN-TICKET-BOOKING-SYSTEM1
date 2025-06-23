import React from 'react'
import AddPassengerBox from './AddPassengerBox'

const PassengerDetailsBox = ({ numberOfPassenger }) => {
    return (
        <>
            {
                Array.from({ length: numberOfPassenger }, (_, i) => (
                    <AddPassengerBox key={i} i={i} />
                ))
            }

        </>
    )
}

export default PassengerDetailsBox