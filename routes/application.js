import express from 'express';
import User from "../models/Student.js";
import Classes from "../models/Classes.js";
import Application from "../models/Application.js";
import { body, validationResult} from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const middlewares = {
    fetchuser: fetchuser,
    upload: upload
}

router.post('/send_application', [middlewares.fetchuser, middlewares.upload.single('file')], async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({"_id": userId}).select("-password");

        if(!user){
            return res.status(404).send("Some error occured contact to your collage");
        }

        let tody = `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}`;
        const application = await Application.findOne({senderId: user.id}).select('to').sort({to: -1});

        if(application){
            let to = (new Date(application.to)).getTime();
            let current = Date.now();
            if(to > current){ 
                return res.status(201).json({'message': "Your application in under consideration."});
            }
        }

        const teacher = await Classes.findOne({branch: user.branch, semester: user.semester, section: user.section}).select("-_id");

        if(!teacher){
            return res.status(404).json({'error': "No such class exist contact to your coordinator"});
        }
        // const informerTecher = await Classes.findOne({branch: user.branch, semester: user.semester, section: user.section}).select('teachers.teacherId');
        // console.log(teacher);

        await Application.create({
            senderId: userId,
            coordinatorId: teacher.coordinatorId,
            subject: req.body.subject,
            reason: req.body.reason,
            leave: req.body.leave,
            from: req.body.from,
            to: req.body.to,
            file: req.file ? req.file.path : null,
            informerId: teacher.teachers
        });

        res.status(200).json({message: "Application sended wait for responce."});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

router.get('/get_recived_application', fetchuser, async (req, res) => {
    try {
        const id = req.user.id;
        // console.log(id);
        const teacher = await User.findOne({'_id': id}).select('userId');
        const application = await Application.find({'coordinatorId': teacher.userId}).select(["reason", "subject", "file", "from", "to", "senderId", "leave", "status", "createdAt"]).sort({createdAt: -1});
        if(!application){
            return res.status(404).json({message: "No application avaliable"});
        }

        let list = [];
        let totalApplication = 0;
        let totalApproved = 0;
        let totalReject = 0;
        let totalPending = 0; 
        
        for(let ele of application) {
            totalApplication++ ;
            ele.status == 'pending'? totalPending++ : ele.status == 'approved' ? totalApproved ++ : totalReject++ ;
            let student = await User.findOne({'_id': ele.senderId}).select(["name", "contact", "userId", "branch", 'semester', 'section', '-_id']);
            let obj = {
                "_id": ele.id,
                "subject": ele.subject,
                "reason": ele.reason,
                "leave": ele.leave,
                "status": ele.status,
                "from": ele.from,
                "to": ele.to,
                "file": ele.file,
                "createdAt": ele.createdAt,
                "studentDetail": student
            }
            list.push(obj)
            // console.log(student);
            // ele['studentDetail'] = student;
        }

        res.status(200).json({message: "Recived application", data: {totalApplication: totalApplication, totalApproved: totalApproved, totalPending: totalPending, totalReject: totalReject, application: list}});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

router.put('/responce_application', fetchuser, async (req, res) => {
    try {
        const id = req.user.id;
        const teacher = await User.findOne({'_id': id}).select('userId');
        const applicationId = req.body.applicationId;
        const updatedApplication = await Application.findOneAndUpdate({'coordinatorId': teacher.userId, '_id': applicationId}, {'status': req.body.status});
        if(!updatedApplication){
            return res.status(404).json({message: "No application avaliable with such details."});
        }
        res.status(200).json({message: "Recived application"});
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

router.get('/get_notifications', fetchuser, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findOne({'_id': id}).select(['name', 'contact', 'branch', 'semester', 'section', 'userId', '-_id', 'role']);
        // console.log(user.role);
        if(user.role == 'student'){
            const notifications = await Application.find({senderId: id}).select('-informerId').sort({createdAt: -1});
            if(!notifications){
                return res.status(404).json({message: "No notification avaliable"});
            }

            let list = [];
            
            for(let ele of notifications) {
                let obj = {
                    "_id": ele.id,
                    "subject": ele.subject,
                    "reason": ele.reason,
                    "leave": ele.leave,
                    "status": ele.status,
                    "from": ele.from,
                    "to": ele.to,
                    "file": ele.file,
                    "createdAt": ele.createdAt,
                    "studentDetail": user
                }
                list.push(obj)
                // console.log(student);
                // ele['studentDetail'] = student;
            }

            res.status(200).json({message: "Notification for you.", notifications: list});
        }
        else{
            const notifications = await Application.find({'informerId.teacherId': user.userId, 'status': 'approved'}).sort({updatedAt: -1});

            if(!notifications){
                return res.status(404).json({message: "No notification avaliable"});
            }

            let list = [];
            
            for(let ele of notifications) {
                let student = await User.findOne({'_id': ele.senderId}).select(["name", "contact", "userId", "branch", 'semester', 'section', '-_id']);
                let obj = {
                    "_id": ele.id,
                    "reason": ele.reason,
                    "leave": ele.leave,
                    "subject": ele.subject,
                    "status": ele.status,
                    "from": ele.from,
                    "to": ele.to,
                    "file": ele.file,
                    "createdAt": ele.createdAt,
                    "studentDetail": student
                }
                list.push(obj)
                // console.log(student);
                // ele['studentDetail'] = student;
            }
            res.status(200).json({message: "Notification for you.", notifications: list});
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

// module.exports = router;
export default router;