const axios = require('axios');
const PlaneService = require('../plane/planeService');
const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';
const SensorService = require('../sensor/sensorService');

const cron = require('node-cron');


const init = async () => {
  let sensors = await SensorService.findAll();
  sensors.forEach((sensor) => {
    cron.schedule('*/15 * * * * *', async () => {
      console.log("in " + sensor.label + ": " + new Date());
      await request(sensor.source);
    });
  })

};

const request = async (host) => {
  let response = await axios.get(host);

  if (response.data && response.data.aircraft) {
    response.data.aircraft.forEach(async (obj, key) => {
      PlaneService.save(obj);
    });
  }
};

module.exports = {
  init
};


