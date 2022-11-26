const express = require('express');
const router = express.Router();
const getAdminCookie = require('../../middleware/getAdminCookie');

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

module.exports = router;