const mongoose = require('mongoose');
const Plane = require('./Plane')

module.exports = class PlaneService {


  async save(obj) {

    if (obj.lat && obj.lon && obj.hex) {
      let plane = await this.find(obj.hex, obj.lat, obj.lon);

      if (plane.length === 0) {
        plane = new Plane(obj);
        plane.location.coordinates = [obj.lat, obj.lon];

        plane.save();
      }
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