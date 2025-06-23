import jwt from 'jsonwebtoken';
import GLOBALS from "../CONSTANTS.js";
import mongoose from "mongoose";
import User from "../model/User.js";
import bcrypt from 'bcrypt';

async function createUser(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    const body = req.body;
    const { name, password, email } = body;

    // console.log(body);

    if (!name || !password || !email) {
        res.status(400).json({ "status": "error", "type": "bad-request", "msg": "Invalid values in request" });
        return;
    }

    console.log(`Name: ${name}, Password: ${password}, Email: ${email}`);

    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log(existingUser);
        res.status(400).json({ "status": "error", "msg": "User already exists" });
        return;
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, password: hashedPassword, email });
    const result = await newUser.save();
    console.log(result);

    if (!result) {
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    // Create auth token for the user
    const secret = process.env.AUTH_TOKEN_SECRET;
    const token = jwt.sign({ id: result._id, name: result.name, email: email, role: result.role }, secret, { expiresIn: '30d' });

    // Set the auth token as cookie
    res.cookie("AUTH_TOKEN", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    res.json({ "status": "success", "msg": "User added successfully", id: result._id, name: result.name, email: result.email, token });
}

export default createUser;