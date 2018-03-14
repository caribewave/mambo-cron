const Plane = require('./plane').planeModel;
const parse = require('csv-parse');
const transform = require('stream-transform');
const fs = require('fs');
const path = require('path');

const aircrafts = {};

const init = async () => {
  
  let p = new Promise((resolve, reject) => {
    const parser = parse({delimiter: ','});
    const input = fs.createReadStream(path.normalize('./assets/aircraft_db.csv'));
    let record;
    // Use the writable stream api
    parser.on('readable', () => {
      while(record = parser.read()) {
        if (record[0] === 'icao') {
          // Skip header row
          return;
        }
        aircrafts[record[0]] = {
          icao: record[0],
          regid: record[1],
          mdl: record[2],
          type: record[3],
          operator: record[4]
        };
      }
    });
    
    // Catch any error
    parser.on('error', (err) => {
      console.error(err.message);
    });
    
    // When we are done, test that the parsed output matched what expected
    parser.on('finish', () => {
      resolve();
    });
    input.pipe(parser);
  });
  return await p;
};

const findAircraftInfo = (icao) => {
  return aircrafts[icao];
};


module.exports = {
  init,
  findAircraftInfo
};