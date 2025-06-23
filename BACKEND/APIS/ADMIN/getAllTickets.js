import jwt from 'jsonwebtoken';
import mongoose from "mongoose"
import GLOBALS from '../../CONSTANTS.js';
import ReservedTicket from '../../model/ReservedTickets.js';
import RegularTicket from '../../model/RegularTickets.js';
import User from '../../model/User.js';

async function getAllTickets_Admin(req, res) {
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

        if (decoded.role !== "admin")
            return res.json({ "status": "error", "type": "unauthorized", "msg": "Unauthorized access 3" });

        decodedData = decoded;
    });
    // console.log(decodedData);

    // Write a MongoDB query to fetch all tickets of today from database
    // connect with database
    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    // Write a MongoDB query to fetch all tickets of today from database
    let allUnreservedTickets = await RegularTicket.find({}, { __v: 0 })
    let allReservedTickets = await ReservedTicket.find({}, { __v: 0 })

    if (!allUnreservedTickets || !allReservedTickets) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    // all useId s in one array
    let allReservedTicketUserIds = allReservedTickets.map(ticket => ticket.userId);
    let allUnreservedTicketUserIds = allUnreservedTickets.map(ticket => ticket.userId);

    let allUserIds = [...allReservedTicketUserIds, ...allUnreservedTicketUserIds];
    allUserIds = [...new Set(allUserIds)];
    console.log(allUserIds);

    const usersResult = await User.find({ _id: { $in: allUserIds } }, { __v: 0, password: 0 });
    console.log(usersResult);

    if (!usersResult) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    //    create an object of all users
    let allUsers = {};
    usersResult.forEach(user => {
        allUsers[user._id] = user.name;
    });

    res.json({ "status": "success", "msg": "Tickets fetched successfully", "unreservedTickets": allUnreservedTickets, "reservedTickets": allReservedTickets, "allUsers": allUsers });
}

export default getAllTickets_Admin