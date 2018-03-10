const axios = require('axios');
const PlaneService = new (require('./PlaneService'))();
const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';


module.exports = class FlightCron {

  launch() {
    this.request(host);
  }

  async request(host) {
    let response = await axios.get(host);

    if (response.data && response.data.aircraft) {
      response.data.aircraft.forEach(async (obj, key) => {
        PlaneService.save(obj);
      });
    }


  }
};

