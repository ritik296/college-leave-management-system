const express = require('express');
const router = express.Router();
const User = require("../../models/Student");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAdmin = require('../../middleware/checkAdmin');
const { body, validationResult} = require('express-validator');

router.post('/admin-login', async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!(username == process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD)) {
            return res.status(401).send({error: "Please try with correct creadentials"});
        }

        const data = {
            access: {
                key: process.env.ADMIN_KEY,
                valid: (Date.now() + 1000*60*60)
            }
        }
        const adminToken = jwt.sign(data, process.env.ADMIN_SECRET);
        res.status(200).json({"message": "Login successfully","admin-token": adminToken});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

// endpoint for create account admin cred
router.post("/create-account", [
    body("name", 'Enter a valid name').isLength({min:3}),
    body('contact', 'Enter 10 digit mobile number').isLength(10),
    body('dob', "Enter dob in (YYYY/MM/DD) format").isDate(),
    body("password", "Password must be 8 length").isLength({min: 8}),
    body("role", "Send the role of profile").exists(["student", 'teacher', 'hod']),
    body('userId', "Enter valid id").isLength({min:5})
], checkAdmin, async (req, res) => {
    try {
        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(400).json({error: error.array()});
        }

        let user = await User.findOne({userId: req.body.userId});
        if (user) {
            return res.status(400).json({ error: "User already exist." });
        }
        else {
            // const salt = await bcrypt.genSalt(10);
            // console.log(salt);
            // const secPassword = await bcrypt.hash(req.body.password, salt);
            // const secPassword = req.body.password;

            user = await User({
                                name: req.body.name,
                                contact: req.body.contact,
                                // email: req.body.email,
                                dob: req.body.dob,
                                // profile_img: req.body.profile_img,
                                password: req.body.password,
                                role: req.body.role,
                                userId: req.body.userId,
                                branch: req.body.branch,
                                semester: req.body.semester,
                                section: req.body.section,
                                batch: req.body.batch,
                                course: req.body.course,
                                
                            });
            user.save();

            // const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(authToken);
            // console.log("added")
            // sendOtp(user.email, res, user);
            res.status(200).json({"message": "Account created successfully."});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal error occured");
    }
});

// endpoint for forget password
router.put('/forget_pass', checkAdmin, async (req, res) => {
    let user = await User.findOne({userId: req.body.userId});

    if(!user) {
        return res.status(400).json({error: "Some error occured"});
    }
    user.password = req.body.password;
    user.save();
    res.status(200).json({"message": "Password updated successfully"});
});

module.exports = router;