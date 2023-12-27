import express from 'express';
const router = express.Router();
import getAdminCookie from '../../middleware/getAdminCookie.js';
import user from './user.js';
import application from './application.js';
import classes from './classes.js';

router.use('/resources/user', user);
router.use('/resources/application', application);
router.use('/resources/classes', classes);

router.get('/', getAdminCookie, async (req, res) => {
    return res.redirect('/admin-dashboard/resources/application');
})

router.get('/login', async (req, res) => {
    try {
        res.status(200).render('admin/login');
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

// router.get('/', getAdminCookie, async (req, res) => {
//     try {
//         res.status(200).render('admin/addUser', {currentPage: "admin-dashboard"});
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('<h1>Internal Server Error</h1>');
//     }
// });

export default router;