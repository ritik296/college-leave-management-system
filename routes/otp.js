import express from 'express';
import User from "../models/Student.js";
import Otp from "../models/Otp.js";
import jwt from 'jsonwebtoken';
import { Auth, LoginCredentials } from "two-step-auth";

const router = express.Router();

router.post('/forget-password', async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findOne({'userId': userId});
        // let otp;
        if(!user){
            return res.status(404).json({"error": "User not exist."});
        }

        let otp = await Auth(`${userId}@piemr.edu.in`, "Leave Management");

        if(otp.status !== 200){
            console.log((await otp.json()).message);
            return res.status(401).json({"error": "Some error occured try again later."})
        }
        otp = await otp.json();
        console.log(otp.OTP);
        
        const otpObj = await Otp.create({
            userId: userId,
            otp: otp.OTP,
            sendedAt: Date()
        });

        const data = {
            token: {
                id: otpObj.id,
                valid: Date.now() + 1000 * 60 * 5
            }
        }
        const otpToken = jwt.sign(data, process.env.OTP_SECRET);

        res.status(200).json({"message": "Otp sended valid for 5 min."});
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error.</h1>");
    }
});


// module.exports = router;
export default router;