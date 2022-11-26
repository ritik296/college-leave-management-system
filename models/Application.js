const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
  senderId: {type: String, required: true},
  coordinatorId: {type: String, required: true},
  subject: {type: String, required: true},
  reason: {type: String, required: true},
  leave: {type: Number, required: true, default: 2},
  from: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return (
          v && // check that there is a date object
          v.getTime() > Date.now() - 24 * 60 * 60 * 1000 
        );
      },
      message:
        "can not apply for already passed date.",
    }
  },
  // to: {type: Date, min: `${(new Date()).getFullYear()}-${(new Date()).getMonth()}-${(new Date()).getDate()}`},
  to: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return (
          v && // check that there is a date object
          v.getTime() > Date.now() 
        );
      },
      message:
        "must be atleast one day.",
    }
  },
  status: {type: String, required: true, default: "pending"},
  file: {type: String},
  informerId: [{teacherId: {type: String, required: true}}]
}, {timestamps: true});

module.exports = mongoose.model('application', applicationSchema);

// , default: `${(new Date()).getFullYear}-${parseInt((new Date()).getFullYear)%1000}`