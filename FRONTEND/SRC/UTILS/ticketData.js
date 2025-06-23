import { decodeJwtData } from "./jwtAuth";
import { createQrCode } from "./qrCode";


const shareTicket = async (ticketData) => {
    if ('share' in navigator) {
        const qrCodeUrl = await createQrCode(ticketData);

        console.log(qrCodeUrl)
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

function downloadTicket(encyptedTicketData) {
    const ticket = decodeJwtData(encyptedTicketData);
    const qrCodeUrl = createQrCode(encyptedTicketData);
    
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `ticket-${ticket.exp}.png`;
    a.click();
}

export { shareTicket, downloadTicket }