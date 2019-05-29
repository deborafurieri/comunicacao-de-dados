const mongoose = require("mongoose");

// estrutura data base
const Schema = mongoose.Schema({
  slaveId: { type: Number, required: true },
  setPoint: { type: Number, required: true },
  value: { type: Number, required: true },
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