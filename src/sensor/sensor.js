const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
  name: String,
  url: String,
  type: String
});

sensorSchema.pre('save', (next) => {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Sensor', sensorSchema);