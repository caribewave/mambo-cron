const axios = require('axios');
const PlaneService = require('../plane/planeService');
// const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';
const SensorService = require('../sensor/sensorService');

const cron = require('node-cron');

let crons = [];

const init = async () => {
  let sensors = await SensorService.findAll();

  sensors.forEach(async (sensor) => {
    await launchCron(sensor);
  })
};

const launchCron = async (sensor) => {
  crons[sensor.label] = await cron.schedule(sensor.schedule, async () => {
    console.log("in " + sensor.label + " at " + new Date());
    await request(sensor.source);
  })
};


const destroyCron = async (label) => {
  await crons[label].destroy();
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
  init,
  destroyCron,
  launchCron,
};


