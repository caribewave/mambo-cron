const mongoose = require('mongoose');

module.exports = class PlaneService {

  static repository = mongoose.connect('mongodb://localhost/mambo', (error) => {
    console.log(error);
  });

  constructor() {
  }


  save(plane) {

  }

};