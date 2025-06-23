import QRCode from 'qrcode'

const createQrCode = async (encryptedTIcketData) => {
    try {
        const result = await QRCode.toDataURL(encryptedTIcketData, { errorCorrectionLevel: "high" })
        return result
    }
    catch (err) {
        console.log('Error in creating QR code function');
        console.log(err)

        return false;
    }
}

export { createQrCode }