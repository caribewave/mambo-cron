const axios = require('axios');
const Plane = require('./Plane');
const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';


module.exports = class FlightCron {

  launch() {
    this.request(host);
  }

  async request(host) {
    let response = await axios.get(host);

    if (response.data && response.data.aircraft) {
      response.data.aircraft.forEach(async (obj, key) => {
        let plane;

        if (obj.lat && obj.lon && obj.hex) {
          plane = await this.find(obj.hex, obj.lat, obj.lon);

          if (plane.length === 0) {
            plane = new Plane(obj);
            plane.location.coordinates = [obj.lat, obj.lon];

            plane.save();
          }
        }
      });
    }


  }

  async find(hex, lat, lng) {
    return Plane.find()
                .where('hex')
                .equals(hex)
                .where('location.coordinates')
                .equals([lat, lng])
                .exec();
  }
};

