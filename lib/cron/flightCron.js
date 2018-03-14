const axios = require('axios');
const PlaneService = require('../plane/planeService');
const Sensor = require('../sensor/sensor').sensorModel;
const Logger = require('../log/Logger')('Flight-Cron');
const cron = require('node-cron');

let crons = [];

const init = async () => {
  let sensors = await Sensor.find({activated: true});

  sensors.forEach(async (sensor) => {
    await launchCron(sensor);
  })
};

const launchCron = async (sensor) => {
  crons[sensor.label] = await cron.schedule(sensor.schedule, async () => {
    Logger.debug("Sensor " + sensor.label + "currently processing at " + new Date());
    await request(sensor.source);
  })
};


const destroyCron = async (label) => {
  if (crons[label]) {
    await crons[label].destroy();
  }
};

const request = async (host) => {
  let response = await axios.get(host);

  if (response.data && response.data.aircraft) {
    response.data.aircraft.forEach(async (obj, key) => {
      await PlaneService.save(obj);
    });
  }
};

module.exports = {
  launchCron,
  destroyCron,
  init
};
