import express from 'express';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import User from '../../models/Student.js';

router.get('/', getAdminCookie, async (req, res) => {
    try {
        const {direction, sortBy, page} = req.query;
        let p = !page || page < 1 ? 1 : page;
        const users = await User.find({}).select(['-section', '-batch', '-course', '-__v', '-createdAt', '-updatedAt', '-password']).skip(!page || page < 1 ? 0 : (page-1)*10).limit(10);
        // console.log(users);
        res.status(200).render('admin/userDatabase', {users: users, currentPage: 'userDatabase', page: parseInt(p)});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/records/:id/show', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({'_id': id});
        // console.log(user);
        res.status(200).render('admin/userShow', {user: user, currentPage: 'userDatabase'});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/records/:id/edit', getAdminCookie, async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({'_id': id});
        // console.log(user);
        res.status(200).render('admin/userEdit', {user: user, currentPage: 'userDatabase'});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

export default router;