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

planeSchema.pre("save", async function (next) {
  let lat = Number.parseFloat(this.location.coordinates[0]);
  let lng = Number.parseFloat(this.location.coordinates[1]);
  let hex = this.hex;


  const query = {
    hex: hex,
    location: {
      $near: {
        $geometry: {
          coordinates: [lat, lng]
        }
      }
    }
  };

  let planes = await planeModel.find(query);

  if (planes.length === 0) {
    this.updated_at = new Date();
    next();
  }
});

module.exports = {
  planeModel
};

