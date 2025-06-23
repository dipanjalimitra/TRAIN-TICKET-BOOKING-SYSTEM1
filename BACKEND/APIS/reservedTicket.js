import jwt from 'jsonwebtoken';
import GLOBALS from '../CONSTANTS.js';
import ReservedTicket from "../model/ReservedTickets.js";
import mongoose from 'mongoose';

async function createReservedTicket(req, res) {

    const { AUTH_TOKEN } = req.body;

    if (!AUTH_TOKEN) {
        return res.json({ "status": "error", "type": "unauthorized", "msg": "Unauthorized access 1" });
    }

    // verify the token
    const authSecret = process.env.AUTH_TOKEN_SECRET;
    let decodedData = null;
    await jwt.verify(AUTH_TOKEN, authSecret, (err, decoded) => {
        if (err) {
            return res.json({ "status": "error", "type": "unauthorized", "msg": "Unauthorized access 2" });
        }
        decodedData = decoded;
    });
    console.log(decodedData);
    const userId = decodedData.id;

    const { sourceStationName, sourceStationCode, destinationStationName, destinationStationCode, numberOfPassenger, passengers, distance, fare } = req.body;

    // validate the request
    if (!sourceStationName || !sourceStationCode || !destinationStationName || !destinationStationCode || !numberOfPassenger || userId === undefined || passengers === undefined || passengers.length <= 0) {
        return res.json({ "status": "error", "msg": "Invalid request" });
    }

    const secret = process.env.TICKET_ENCRYPTION_SECRET;
    // create a new ticket with jwt token
    const token = jwt.sign({ sourceStationName, sourceStationCode, destinationStationName, destinationStationCode, numberOfPassenger, userId, passengers, distance, fare, type: "Reserved" }, secret, { expiresIn: '2d' });

    // connect with database
    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    const newTicket = new ReservedTicket({ userId, sourceStation: { name: sourceStationName, code: sourceStationCode }, destinationStation: { name: destinationStationName, code: destinationStationCode }, numberOfPassengers: numberOfPassenger, passengers, distance, fare, ticketData: token, expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) });

    const result = await newTicket.save();

    if (!result) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }
    console.log(result);

    res.json({ "status": "success", "msg": "Ticket created successfully", "data": token, id: result._id });
}

export default createReservedTicket;
