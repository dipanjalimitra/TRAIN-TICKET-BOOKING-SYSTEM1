import React, { useEffect, useState } from 'react'
import Scanner from './Scanner'
import { decodeJwtData } from '../utils/jwtAuth';
import CONSTANTS from '../../CONSTANTS';
import TicketResultBox from './VerifyTicket/TicketResultBox';
import { toast } from 'react-toastify'


const ScanQrBody = () => {
    const [qrData, setQrData] = useState(null);
    const [decodeResult, setDecodeResult] = useState({ status: null, message: null, data: null })

    async function verifyTicketFromServer(ticket) {
        try {

            const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.verifyTicket}`
            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticket: ticket })
            }

            const response = await fetch(API, params).then(response => response.json());
            console.log(response);

            if (response.status === "success") {
                toast.success("Ticket verified");

                setDecodeResult({
                    status: "success",
                    message: "Valid Ticket",
                    data: response.data
                });

            } else {
                toast.error("Invalid ticket");
                setDecodeResult({
                    status: "error",
                    message: "Invalid Ticket",
                    data: null
                });
            }

        } catch (error) {
            toast.error("Error in verifying ticket");
        }
    }


    useEffect(() => {
        console.log("useEffect 1");

        if (qrData) {
            console.log("QR Data: ", qrData);
            verifyTicketFromServer(qrData);
        }

        return () => {
            console.log("cleanup 1")

            if (qrData) 
                setQrData(null);
                // setDecodeResult({ status: null, message: null, data: null })
        }
    }, [qrData])



    return (
        <div className='container my-3'>
            <h1>Scan Ticket QR Code</h1>
            <Scanner qrData={qrData} setQrData={setQrData} />

            {
                (decodeResult.status !== null) &&
                <TicketResultBox decodedResult={decodeResult} />
            }

        </div>
    )
}

export default ScanQrBody