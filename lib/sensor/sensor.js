const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sensorSchema = new Schema({
  label: String,
  source: String,
  type: String,
  schedule: {type: String, default: "*/15 * * * * *"}
});

sensorSchema.pre('save', async function (next) {
  this.source = Buffer.from(this.source)
                      .toString('base64');

  let sensor = await sensorModel.find({
    source: this.source
  });

  if (sensor.length === 0) {
    this.updated_at = new Date();
    next();
  }
});

sensorSchema.post('init', async function () {
  this.source = Buffer.from(this.source, 'base64')
                      .toString()
});


const sensorModel = mongoose.model('Sensor', sensorSchema);
module.exports = {
  sensorModel
};