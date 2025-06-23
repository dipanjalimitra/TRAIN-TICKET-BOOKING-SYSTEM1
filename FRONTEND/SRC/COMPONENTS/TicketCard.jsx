import React, { useEffect, useState } from 'react'
import shareIcon from "../../public/images/share-fill.svg";
import QRCode from 'qrcode'

const TicketCard = ({ encryptedTIcketData, ticketData }) => {
  const [imageUrl, setImageUrl] = useState("")

  const createQrCode = () => {
    console.log(`Ticket Data Length : ${encryptedTIcketData.length}`)

    QRCode.toDataURL(encryptedTIcketData, { errorCorrectionLevel: "high" })
      .then((result) => {
        setImageUrl(result);
      }).catch((err) => {

        console.log(err);
      })
  }

  const shareTicket = () => {
    if ('share' in navigator) {
      const newFile = imageDataUrlToFIle(imageUrl);

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

  useEffect(() => {
    createQrCode()

  }, [encryptedTIcketData])



  return (
    <div className="border border-primary">
      <p>Ticket Qr Code</p>

      <div className="d-flex ticket-card flex-wrap">

        <img className="img-fluid mx-auto" src={imageUrl} alt="Ticket" />
        <br />

        <button onClick={shareTicket} type="button" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-share-fill" viewBox="0 0 16 16">
            <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"></path>
          </svg>
          <span className='ms-2'>Share Ticket</span>
        </button>
      </div>

    </div>
  )
}

export default TicketCard