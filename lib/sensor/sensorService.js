const Sensor = require('./sensor').sensorModel;
const FlightCron = require('../cron/flightCron');

const findAll = async () => {
  return await Sensor.find({});
};

const save = async (sensorParam) => {
  let sensor = new Sensor(sensorParam);

  try {
    await sensor.save();
    sensor.source = Buffer.from(sensor.source, 'base64')
        .toString();
    if (sensor.activated) {
      FlightCron.launchCron(sensor);
    }
  } catch (e) {
    throw e;
  }
  return sensor;
};

const remove = async (label) => {
  await Sensor.remove({label: label});
  await FlightCron.destroyCron(label);
};

const findByLabel = async (label) => {
  return await Sensor.find({
    label: label
  });
};

const activate = async (label, activate) => {
  return await Sensor.findOneAndUpdate({label: label}, {$set: {activated: activate}}, {new: true});
};


module.exports = {
  findAll,
  findByLabel,
  save,
  remove,
  activate
};