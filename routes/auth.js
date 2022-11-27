const express = require('express');
const router = express.Router();
const User = require("../models/Student");
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const checkAdmin = require('../middleware/checkAdmin');

// endpoint for login account
router.post("/login", [
    body('userId', "Enter a valid userId").isLength({min: 5}),
    body("password", "Password can not be empty").exists()
    ], async (req, res) => {
    try {
        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(400).json({userId: error.array()});
        }

        const {password, userId} = req.body;

        const user = await User.findOne({userId: userId});

        if(!user){
            return res.status(400).json({error: "please login with correct credentails."});
        }
        
        const passwordCompare = await user.comparePassword(password);
        if(!passwordCompare) {
            return res.status(400).json({error: "please login with correct credentails."});
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        // console.log(authToken);

        res.status(200).json({ message: "User successfully login.", authToken: authToken});

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal error occured");
    }
});

// forget password admin cred
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({"_id": userId}).select(["-_id", "-password"]);
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

// change password with old id and password
router.put('/change_pass', fetchuser, async (req, res) => {
    try {
        const {password, newPassword} = req.body;
        const userId = req.user.id;
        let user = await User.findOne({"_id": userId});

        if(!user){
            return res.status(400).json({error: "please contact with your collage or use correct cred."});
        }
        
        const passwordCompare = await user.comparePassword(password);
        if(!passwordCompare) {
            return res.status(400).json({error: "Invalid password, contact your collage."});
        }

        user.password = newPassword;
        user.save();

        res.status(200).json({"message": "Password updated."});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

module.exports = router;