const axios = require('axios');
const PlaneService = require('../plane/planeService');
const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';

const cron = require('node-cron');



const init = async () => {
  cron.schedule('*/5 * * * *', async () => {
    await request(host);
  });

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


