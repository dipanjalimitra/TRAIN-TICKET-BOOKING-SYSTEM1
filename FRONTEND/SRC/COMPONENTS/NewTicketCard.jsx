import React, { useState } from 'react'
import '../styles/RegularTicket.css'
import { decodeJwtData } from '../utils/jwtAuth'
import { createQrCode } from '../utils/qrCode';

const NewRegularTicketCard = ({ ticketData, id }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const ticket = decodeJwtData(ticketData);

    console.log(`Ticket Card Data:`);
    console.log(id);
    console.log(ticket);

    const dateTime = new Date(ticket.exp * 1000);
    let expiryDate = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;

    createQrCode(ticketData).then((res) => {
        if (res) {
            setQrCodeUrl(res);
        }
    });

    const shareTicket = () => {
        if ('share' in navigator) {
            const newFile = imageDataUrlToFIle(qrCodeUrl);

            navigator.share({ title: "Train Ticket", files: [newFile] })
        } else {
            console.log("Sharing is not possible")
        }
    }

    function imageDataUrlToFIle(imageDataUrl) {
        // Convert data URL to Blob
        const byteString = atob(imageDataUrl.split(',')[1]);
        const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        // Create a File object
        const file = new File([blob], "image.png", { type: mimeString });

        // Now 'file' contains your image as a File object
        return file;
    }

    function downloadTicket() {
        const a = document.createElement('a');
        a.href = qrCodeUrl;
        a.download = `ticket-${ticket.exp}.png`;
        a.click();
    }


    return (
        <main className="ticket-system m-auto">
            <div className="top">
                <div className="printer" />
            </div>
            <div className="receipts-wrapper">
                <div className="receipts">
                    <div className="receipt">
                        <span className='text-ticket'>#{id}</span>
                        <div className='brand-logo'>
                            <img src="/images/icon-192.png" alt="" />
                            <span>TBS</span>
                        </div>
                        <div className="route">
                            <div className="text-left">
                                <h2 className="text-uppercase">{ticket.sourceStationName}</h2>
                                <small>{ticket.sourceStationCode}</small>
                            </div>

                            <img src="/images/train-icon.svg" alt="" />


                            <div className="text-right">
                                <h2 className="text-uppercase">{ticket.destinationStationName}</h2>
                                <small>{ticket.destinationStationCode}</small>
                            </div>
                        </div>
                        <div className="details">
                            <div className="item">
                                <span>Passanger</span>
                                <h3>{ticket.numberOfPassenger}</h3>
                            </div>
                            <div className="item">
                                <span>Price</span>
                                <h3>{ticket.fare} Rs.</h3>
                            </div>
                            <div className="item">
                                <span>Valid Till</span>
                                <h3>{expiryDate}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="receipt qr-code gap-2 py-3">
                        <div className="description">
                            <p>Show QR-code when requested</p>
                        </div>

                        <div className="qrcodeImageContainer">
                            <img src={ticketData
                                ? qrCodeUrl
                                : ''} className='zoomOnHover' tabIndex="1" alt="Ticket QR Code" />
                        </div>

                        <div className="optionsBox d-flex flex-row w-100 align-items-center justify-content-between px-2">
                            <button onClick={shareTicket} type="button" className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-share-fill" viewBox="0 0 16 16">
                                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"></path>
                                </svg>
                                <span className='ms-2'>Share</span>
                            </button>

                            <button onClick={downloadTicket} type="button" className="btn btn-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
                                </svg>
                                <span className='ms-2'>Download</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewRegularTicketCard