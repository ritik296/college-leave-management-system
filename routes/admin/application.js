import express from 'express';
import { Query } from 'mongoose';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import Application from '../../models/Application.js';

router.get('/', getAdminCookie, async (req, res) => {
    try {
        const {page, subject, leave, status} = req.query;
        let p = !page || page < 1 ? 1 : page;
        let query = {};
        let strQuery = '?';
        subject ? (()=>{ query.subject = {"$regex": subject, "$options": "i"}; strQuery += 'subject=' + subject +"&" })(): null;
        leave ? (()=> { query.leave = leave; strQuery += 'leave=' + leave +"&"})(): null;
        status ? (()=>{ query.status = status; strQuery += 'status=' + status +"&" })(): null;

        const applications = await Application.find(query).select(['-__v', '-createdAt', '-updatedAt', '-senderId']).skip(!page || page < 1 ? 0 : (page-1)*10).limit(10);
        
        res.status(200).render('admin/applicationDatabase', {applications: applications, currentPage: 'application-database', page: parseInt(p), query: strQuery});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/records/:id/show', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const application = await Application.findOne({'_id': id});
        if(!application){
            return res.status(404).render('error.pug');
        }
        res.status(200).render('admin/applicationShow', {application: application, currentPage: 'application-database'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

router.get('/records/:id/edit', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const application = await Application.findOne({'_id': id});
        if(!application){
            return res.status(404).render('error.pug');
        }
        res.status(200).render('admin/applicationEdit', {application: application, currentPage: 'application-database'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

// router.get('/action/new', getAdminCookie, async (req, res) => {
//     try {
//         res.status(200).render('admin/addUser', {currentPage: 'addUser'});
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('<h1>Internal Server Error</h1>');
//     }
// });

export default router;