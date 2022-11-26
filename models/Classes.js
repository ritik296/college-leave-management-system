const mongoose = require('mongoose');
const { Schema } = mongoose;

const classesSchema = new Schema({
  branch: {type: String, required: true},
  semester: {type: String, required: true},
  section: {type: String, required: true},
  coordinatorId: {type: String, require: true},
  teachers: [{teacherId: {type: String, required: true}, subjectName: {type: String, required: true}, subjectCode: {type: String, required: true}}]
}, {timestamps: true});

module.exports = mongoose.model('classes', classesSchema);

// , default: `${(new Date()).getFullYear}-${parseInt((new Date()).getFullYear)%1000}`