const Sensor = require('./sensor').sensorModel;
const FlightCron = require('../cron/flightCron');

const findAll = async () => {
  return await Sensor.find({});
};

const save = async (sensorParam) => {
  let sensor = new Sensor(sensorParam);

  try {
    await sensor.save();
    await FlightCron.launchCron(result);
  } catch (e) {
    throw e;
  }

  return sensor;
};

const findByLabel = async (label) => {
  return await Sensor.find({
    label: label
  });
};


module.exports = {
  findAll,
  findByLabel,
  save
};