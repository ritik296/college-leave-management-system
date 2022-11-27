const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  name:  {type: String, required: true},
  contact: {type: String}, 
  dob: {type: String, required: true}, 
  password: {type: String, required: true},
  role: {type: String, required: true, default: "student"},
  userId: {type: String, required: true, unique: true},
  branch: {type: String},
  semester: {type: Number},
  section: {type: String},
  batch: {type: String},
  course: {type: String},
}, {timestamps: true});


userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    // console.log(this.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

// userSchema.pre('update', async function save(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

userSchema.methods.comparePassword = async function comparePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model('user', userSchema);

// , default: `${(new Date()).getFullYear}-${parseInt((new Date()).getFullYear)%1000}`