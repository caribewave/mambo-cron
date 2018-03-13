const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planeSchema = new Schema({
  id: String,
  hex: String,
  location: {
    type: {$type: String, default: 'Point'},
    coordinates: [Number, Number]
  },
  altitude: Number,
  speed: Number,
  flightNumber: String,
  updated_at: Date,
  squawk: String,
  track: Number,
  vert_rate: Number,
  category: String,
  seen_pos: Number,
  seen: Number,
  messages: Number,
}, {typeKey: '$type'});

planeSchema.index({location: '2dsphere'});

const planeModel = mongoose.model('Plane', planeSchema);


module.exports = {
  planeModel
};

