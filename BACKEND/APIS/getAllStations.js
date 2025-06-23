import Station from '../model/stations.js';
import mongoose from 'mongoose';
import GLOBALS from '../CONSTANTS.js';

async function getAllStations(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    // exclude the __v & createdAt field from the query
    const stations = await Station.find({}, { __v: 0, createdAt: 0 });

    if (!stations) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }


    res.json({ "status": "success", "msg": "Stations fetched successfully", "data": stations });
}

export default getAllStations;