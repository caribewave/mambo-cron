const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planeSchema = new Schema({
  id: String,
  hex: String,
  lat: Number,
  lng: Number,
  altitude: Number,
  speed: Number,
  flightNumber: String,
  updated_at: Date
});

planeSchema.pre('save', (next) => {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Plane', planeSchema);

