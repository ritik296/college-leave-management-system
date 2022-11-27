const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const getCookieForId = require('../middleware/getCookieForId');
const User = require("../models/Student");

router.get('/sign-in', async (req, res) => {
    try {
        res.status(200).render('login');
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

router.get('/sign-up', async (req, res) => {
    try {
        res.status(200).render('register');
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

router.get('/', getCookieForId, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({"_id": userId}).select(["name", "-_id", "role"]);
        // console.log(user);
        if(user.role == 'student') {
            res.status(200).render('leaveApplication', {user: user, currentPage: "leaveApplication"});
        } else {
            res.status(200).render('application', {user: user, currentPage: "application"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

router.get('/notifications', getCookieForId, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({"_id": userId}).select(["name", "-_id", "role"]);

        res.status(200).render('notification', {user: user, currentPage: "notification"});
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});


router.get('/navigation', async (req, res) => {
    try {
        res.status(200).render('landing');
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

router.get('/change-password', getCookieForId, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({"_id": userId}).select(["name", "-_id", "role"]);
        res.status(200).render('changePassword', {user: user, currentPage: "change-password"});
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

router.get('*', async (req, res) => {
    try {
        res.status(404).render('error');
    } catch (error) {
        console.log(error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

module.exports = router;