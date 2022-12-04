import express from "express";
import path from 'path';
import connectToMongo from './db.js';
import cookieParser from "cookie-parser";

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
// const __dirname = path.dirname(__filename);

connectToMongo();

const app = express();

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use('/static', express.static('static'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'pug');

app.use(express.static(path.join(path.dirname(__filename), 'public')));

app.set('views', path.join(path.dirname(__filename), 'views'));

import auth from './routes/auth.js';
import application from './routes/application.js';
import classes from './routes/class.js';
import otp from './routes/otp.js';
import adminApi from './routes/admin/adminApi.js';
import upload from './routes/uploadImage.js';

app.use('/api/v1/auth', auth);
app.use('/api/v1/application', application);
app.use('/api/v1/class', classes);
app.use('/api/v1/otp', otp);
app.use('/api/admin/', adminApi);
app.use('/upload', upload);

import admin from './routes/admin/admin.js';

app.use('/admin-dashboard', admin);

import adminRouter from './routes/admin/admin.router.js';

app.use('/admin', adminRouter);

import website from './routes/website.js';

app.use('/', website);

let port;
app.listen(port = process.env.PORT, () => {
    console.log(`App is runing on http://localhost:${port}`);
});