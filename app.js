const express = require("express");
const path = require('path');
const connectToMongo = require('./db');
const cookieParser = require("cookie-parser");

connectToMongo();

const app = express();

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use('/static', express.static('static'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/application', require('./routes/application'));
app.use('/api/v1/class', require('./routes/class'));
app.use('/api/v1/otp', require('./routes/otp'));
app.use('/api/admin/', require('./routes/admin/adminApi'));

app.use('/admin', require('./routes/admin/admin.router'));

app.use('/', require('./routes/website'));


app.listen(port = process.env.PORT, () => {
    console.log(`App is runing on http://localhost:${port}`);
});