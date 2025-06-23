import jwt from 'jsonwebtoken';
import GLOBALS from "../CONSTANTS.js";
import mongoose from "mongoose";
import User from "../model/User.js";
import bcrypt from 'bcrypt';

async function loginUser(req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    const body = req.body;
    const { email, password } = body;

    console.log('All Cookies');
    console.log(req.cookies);

    // console.log(body);
    if (!password || !email) {
        res.status(400).json({ "status": "error", "type": "bad-request", "msg": "Invalid values in request" });
        return;
    }

    console.log(`Password: ${password}, Email: ${email}`);

    // const connection = await mongoose.connect(GLOBALS.mongoURI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    if (!connection) {
        console.log("MongoDB connection failed");
        res.status(500).json({ "status": "error", "msg": "Internal Server Error" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        console.log(existingUser);
        res.status(400).json({ "status": "error", "msg": "User does not exist" });
        return;
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
        res.status(400).json({ "status": "error", "msg": "Invalid password" });
        return;
    }

    // Create auth token for the user
    const secret = process.env.AUTH_TOKEN_SECRET;
    const token = jwt.sign({ id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role }, secret, { expiresIn: '30d' });

    // Set the auth token as cookie
    res.cookie("AUTH_TOKEN", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });


    res.json({ "status": "success", "msg": "Logged In successfully", id: existingUser._id, name: existingUser.name, email: existingUser.email, token });
}

export default loginUser;