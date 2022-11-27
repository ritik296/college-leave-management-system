const express = require('express');
const router = express.Router();
const User = require("../models/Student");
const Application = require("../models/Application");
const Classes = require("../models/Classes");
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const checkAdmin = require('../middleware/checkAdmin');

router.post('/add_class', [
    body('branch', "Enter branch").exists(),
    body('semester', "Enter semester").isInt({min:1, max:8}),
    body('section', "Enter Array of teachers").exists(),
    body('coordinatorId', "Coordinator id is must").exists()
], checkAdmin, async (req, res) => {
    try {
        const error = validationResult(req);

        if(!error.isEmpty()) {
            return res.status(400).json({userId: error.array()});
        }
        
        let classes = await Classes.findOne({branch: req.body.branch, semester: req.body.semester, section: req.body.section});
        if(classes){
            return res.status(400).send("This class is already created");
        }
        if(!(await User.findOne({userId: req.body.coordinatorId}))){
            return res.status(404).json({"error": "Invalid coordinator id"});
        }
        classes = await Classes.create(req.body);
        res.status(200).json({message: "Application sended wait for responce.", "class": classes});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});



module.exports = router;