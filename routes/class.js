import express from 'express';
import User from "../models/Student.js";
import Application from "../models/Application.js";
import Classes from "../models/Classes.js";
import { body, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

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
        res.status(200).json({message: "Class Added", "class": classes});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});


router.put('/update-classes', checkAdmin, async (req, res) => {
    try {
        const {branch, semester, section, teachers, coordinatorId} = req.body;

        let classes = await Classes.findOne({branch: branch, semester: semester, section: section});
        if(!classes){
            return res.status(404).send("No such class exist.");
        }

        if(!(await User.findOne({userId: coordinatorId}))){
            return res.status(404).json({"error": "Invalid coordinator id"});
        }

        if(coordinatorId !== classes.coordinatorId){
            classes.coordinatorId = coordinatorId;
        }

        if(teachers !== classes.teachers){
            classes.teachers = teachers;
        }

        classes.save();

        res.status(200).json({'message': "Class detail updated."});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error"); 
    }
});

// module.exports = router;
export default router;