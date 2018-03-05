const Request = require('Request');
const Plane = require('./Plane');
const mongoose = require('mongoose');

const host = 'http://vps358558.ovh.net:2050/dump1090/data/aircraft.json';


module.exports = class FlightInfoService {
  performRequest() {
    Request.get(host, (error, response, body) => {


      let responseBody = JSON.parse(response.body);

      responseBody.aircraft.forEach((obj) => {

        if(obj.lat && obj.lon){

          let plane = new Plane();
          plane.hex = obj.hex;
          plane.lat = obj.lat;
          plane.lng = obj.lon;
          plane.altitude = obj.altitude;

          plane.save();
        }


      });

    })
  }
};
