import express from 'express';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import user from './user.js';
import application from './application.js';

router.get('/', getAdminCookie, async (req, res) => {
    try {
        res.status(200).render('admin/addUser', {currentPage: "admin-dashboard"});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/forget-password', getAdminCookie, async (req, res) => {
    try {
        res.status(200).render('admin/forgetPassword', {currentPage: "forget-password"});
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.get('/login', async (req, res) => {
    try {
        res.status(200).render('admin/login');
    } catch (error) {
        console.log(error);
        res.status(500).send('<h1>Internal Server Error</h1>');
    }
});

router.use('/resources/user', user);
router.use('/resources/application', application);

// module.exports = router;
export default router;