const express = require("express");
const path = require('path');
const connectToMongo = require('./db');
const cookieParser = require("cookie-parser");

// const AdminBro = require('admin-bro');
// const AdminBroExpress = require('admin-bro-expressjs');
// const mongooseAdminBro = require('@admin-bro/mongoose');
// const expressAdminBro = require('@admin-bro/express');


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
app.use('/api/admin/', require('./routes/admin/adminApi'));

app.use('/admin', require('./routes/admin/admin.router'));

// const Application = require('./models/Application');
// const Classes = require('./models/Classes');
// const User = require('./models/Student');

// AdminBro.registerAdapter(mongooseAdminBro)
// const AdminBroOptions = {
//     resources: [Application, Classes, User],
// }

// const adminBro = new AdminBro(AdminBroOptions)
// const router = expressAdminBro.buildRouter(adminBro)

// app.use(adminBro.options.rootPath, router)


app.use('/admin-dashboard', require('./routes/admin/admin'))
app.use('/', require('./routes/website'));


app.listen(port = process.env.PORT, () => {
    console.log(`App is runing on http://localhost:${port}`);
});