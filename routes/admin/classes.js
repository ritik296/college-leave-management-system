import express from 'express';
import { Query } from 'mongoose';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import Classes from '../../models/Classes.js';

router.get('/', getAdminCookie, async (req, res) => {
    try {
        const {page, coordinatorId, semester, section, branch} = req.query;
        let p = !page || page < 1 ? 1 : page;
        let query = {};
        let strQuery = '?';

        coordinatorId ? (()=>{ query.coordinatorId = coordinatorId; strQuery += 'coordinatorId=' + coordinatorId +"&" })(): null;
        semester ? (()=>{ query.semester = semester; strQuery += 'semester=' + semester +"&" })(): null;
        section ? (()=>{ query.section = section; strQuery += 'section=' + section +"&" })(): null;
        branch ? (()=> { query.branch = branch; strQuery += 'branch=' + branch +"&" })(): null;

        const classes = await Classes.find(query).select(['-__v',  '-updatedAt', '-teachers']).skip(!page || page < 1 ? 0 : (page-1)*10).limit(10);
        
        res.status(200).render('admin/classesDatabase', {classes: classes, currentPage: 'classes-database', page: parseInt(p), query: strQuery});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/records/:id/show', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const classes = await Classes.findOne({'_id': id});
        if(!classes){
            return res.status(404).render('error.pug');
        }
        res.status(200).render('admin/classesShow', {classes: classes, currentPage: 'classes-database'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

router.get('/records/:id/edit', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const classes = await Classes.findOne({'_id': id});
        if(!classes){
            return res.status(404).render('error.pug');
        }
        res.status(200).render('admin/classesEdit', {classes: classes, currentPage: 'classes-database'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

router.get('/action/new', getAdminCookie, async (req, res) => {
    try {
        res.status(200).render('admin/addClasses', {currentPage: 'classes-database'});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.delete('/records/:id/delete', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const classes = await Classes.findByIdAndDelete({'_id': id});
        if(!classes){
            return res.status(404).render('error');
        }
        res.status(200).json({'message': `Class ${classes.id} removed successfully.`});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

export default router;