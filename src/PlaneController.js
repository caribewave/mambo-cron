const mongoose = require('mongoose');
const express = require('express');
const Plane = require('./Plane');

let app = express();

let aggregate = [
  {
    $group: {
      _id: "$hex",
      coordinates: {$push: "$location"}
    }
  }
];

function onGetAll(req, res) {
  let planes = "test";
  Plane.aggregate(aggregate, (err, results) => {
    planes = results;
    res.end(JSON.stringify(planes));
  });

}

async function onGetLoc(req, res) {
  let lat = req.query.lat;
  let lng = req.query.lng;

  lat = 49.602247;
  lng = 1.339664;

  let min = req.query.min || 0;
  let max = req.query.max || 10000;


  let query = {
    location:
        {
          $near:
              {
                $geometry: {type: "Point", coordinates: [lat, lng]},
                $minDistance: min,
                $maxDistance: max
              }
        }
  };


  // let result = await Plane.find(query);

  result = [{
    "location": {"type": "Point", "coordinates": [[49.602247, 1.339664], [49.602247, 1.339666g]]},
    "_id": "5a9ff37e3219088decdfd69a",
    "hex": "400685",
    "seen_pos": 5.1,
    "altitude": 36700,
    "messages": 10,
    "seen": 4.3,
    "__v": 0
  }];
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;