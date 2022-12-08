import express from 'express';
import { Query } from 'mongoose';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import User from '../../models/Student.js';

router.get('/records/:id/show', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({'_id': id});
        if(!user){
            return res.status(404).render('error');
        }
        // console.log(user);
        res.status(200).render('admin/userShow', {user: user, currentPage: 'userDatabase'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

router.get('/records/:id/edit', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({'_id': id});
        if(!user){
            return res.status(404).render('error');
        }
        // console.log(user);
        res.status(200).render('admin/userEdit', {user: user, currentPage: 'userDatabase'});
    } catch (error) {
        console.log(error.message);
        res.status(404).render('error.pug');
    }
});

router.get('/action/new', getAdminCookie, async (req, res) => {
    try {
        res.status(200).render('admin/addUser', {currentPage: 'userDatabase'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/', getAdminCookie, async (req, res) => {
    try {
        const {direction, sortBy, page, name, contact, userId, role, semester, section, branch} = req.query;
        let p = !page || page < 1 ? 1 : page;
        let query = {};
        let strQuery = '?';
        name ? (()=>{ query.name = {"$regex": name, "$options": "i"}; strQuery += 'name=' + name +"&" })(): null;
        contact ? (()=> { query.contact = contact; strQuery += 'contact=' + contact +"&"})(): null;
        userId ? (()=>{ query.userId = userId; strQuery += 'userId=' + userId +"&" })(): null;
        role ? (()=>{ query.role = role; strQuery += 'role=' + role +"&" })(): null;
        semester ? (()=>{ query.semester = semester; strQuery += 'semester=' + semester +"&" })(): null;
        section ? (()=>{ query.section = section; strQuery += 'section=' + section +"&" })(): null;
        branch ? (()=> { query.branch = branch; strQuery += 'branch=' + branch +"&" })(): null;

        const users = await User.find(query).select(['-section', '-batch', '-course', '-__v', '-createdAt', '-updatedAt', '-password']).skip(!page || page < 1 ? 0 : (page-1)*10).limit(10);
        
        res.status(200).render('admin/userDatabase', {users: users, currentPage: 'userDatabase', page: parseInt(p), query: strQuery});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});
export default router;