import Station from '../model/stations.js';
import mongoose from 'mongoose';
import GLOBALS from '../CONSTANTS.js';
import getEnvirnoment from '../start.js';

async function addNewStation(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    const body = req.body;
    let { name, code, lat, long } = body;

    console.log(body);

    if (!name || !code || !lat || !long) {
        res.status(400).json({ "status": "error", "type": "bad-request", "msg": "Invalid values in request" });
        return;
    }

    // Convert lat and long to Number
    lat = Number(lat);
    long = Number(long);

    // Check if lat and long are valid numbers
    if (isNaN(lat) || isNaN(long)) {
        res.status(400).json({ "status": "error", "msg": "Invalid values in request" });
        return;
    }

    console.log(`Name: ${name}, Code: ${code} Lat: ${lat}, Long: ${long}`);

    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    const existingStation = await Station.findOne({ code });

    if (existingStation) {
        console.log(existingStation);
        res.status(400).json({ "status": "error", "msg": "Station code already exists" });
        return;
    }

    const newStation = new Station({ name, code, lat, long });
    const result = await newStation.save();

    if (!result) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    res.json({ "status": "success", "msg": "Station added successfully", name, code });
}

export default addNewStation;