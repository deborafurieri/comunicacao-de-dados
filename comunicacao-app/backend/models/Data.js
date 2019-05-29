const mongoose = require("mongoose");

// estrutura data base
const Schema = mongoose.Schema({
  slaveId: { type: Number },
  setPoint: { type: Number },
  value: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

Schema.pre('save', function (next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

mongoose.model('Data', Schema);