import jwt from 'jsonwebtoken';
import RegularTicket from '../model/RegularTickets.js';
import GLOBALS from '../CONSTANTS.js';
import mongoose from 'mongoose';

async function createRegularTicket(req, res) {

    let { sourceStationName, sourceStationCode, destinationStationName, destinationStationCode, numberOfPassenger, fare, distance, AUTH_TOKEN } = req.body;

    if (!AUTH_TOKEN) {
        return res.json({ "status": "error", "type": "unauthorized", "msg": "Unauthorized access 1" });
    }

    // verify the token
    const encryptionSecret = process.env.AUTH_TOKEN_SECRET;
    let decodedData = null;

    await jwt.verify(AUTH_TOKEN, encryptionSecret, (err, decoded) => {
        if (err) {
            return res.json({ "status": "error", "type": "unauthorized", "msg": "Unauthorized access 2" });
        }

        decodedData = decoded;
    });

    console.log(decodedData);
    const userId = decodedData.id;

    // validate the request
    if (!sourceStationName || !sourceStationCode || !destinationStationName || !destinationStationCode || !numberOfPassenger || !fare || !distance) {
        return res.json({ "status": "error", "message": "Invalid request" });
    }

    // create token for ticket
    const secret = process.env.TICKET_ENCRYPTION_SECRET;

    // create a new ticket with jwt token
    const token = jwt.sign({ sourceStationName, sourceStationCode, destinationStationName, destinationStationCode, numberOfPassenger, userId, fare, distance, type: "Unreserved" }, secret, { expiresIn: '24h' });

    // connect with database
    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }


    const newTicket = new RegularTicket({ userId, sourceStation: { name: sourceStationName, code: sourceStationCode }, destinationStation: { name: destinationStationName, code: destinationStationCode }, numberOfPassengers: numberOfPassenger, distance, fare, ticketData: token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    const result = await newTicket.save();

    if (!result) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }
    console.log(result);


    // send the token to the user
    res.json({ "status": "success", "message": "Ticket created successfully", "data": token, id: result._id });
}

export default createRegularTicket;
