import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_DATABASE_URL, () => {
        console.log("Connect to mongo successfully");
    });
}

// module.exports.connectToMongo = connectToMongo;
export default connectToMongo;