const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sensorSchema = new Schema({
  label: String,
  source: {$type: String, unique: true},
  location: {
    type: {$type: String, default: 'Point'},
    coordinates: {$type: [Number, Number], default: [-61.30107, 15.9368839]}
  },
  type: String,
  activated: {$type: Boolean, default: false},
  schedule: {$type: String, default: "*/15 * * * * *"}
}, {typeKey: '$type'});

sensorSchema.index({location: '2dsphere'});

sensorSchema.pre("save", async function (next) {
  this.source = Buffer.from(this.source)
                      .toString('base64');
  next();
}, {typeKey: '$type'});

sensorSchema.pre("findOneAndUpdate", async function (next) {
  this._update.$set.source = Buffer.from(this._update.$set.source)
                                   .toString('base64');
  next();
});

sensorSchema.post("init", async function () {
  this.source = Buffer.from(this.source, 'base64')
                      .toString()
});


const sensorModel = mongoose.model('Sensor', sensorSchema);
module.exports = {
  sensorModel
};