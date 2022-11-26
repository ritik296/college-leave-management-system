const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_DATABASE_URL, () => {
        console.log("Connect to mongo successfully");
    });
}

module.exports = connectToMongo;