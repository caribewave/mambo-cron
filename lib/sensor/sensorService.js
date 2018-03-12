const Sensor = require('./sensor').sensorModel;

const findAll = async () => {
  return await Sensor.find();
};

const save = async (sensorParam) => {
  let sensor = new Sensor(sensorParam);
  sensor.save();

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