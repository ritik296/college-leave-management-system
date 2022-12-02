import mongoose from 'mongoose';
const { Schema } = mongoose;

const OtpSchema = new Schema({
  userId: {type: String, required: true},
  otp: {type: Number, required: true},
  sendedAt: {type: Date, default: Date(), require: true},
}, {timestamps: true});

OtpSchema.index({sendedAt: 1}, {expireAfterSeconds: 60*10});

// module.exports = mongoose.model('otp', OtpSchema);
export default mongoose.model('otp', OtpSchema);

// , default: `${(new Date()).getFullYear}-${parseInt((new Date()).getFullYear)%1000}`