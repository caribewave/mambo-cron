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


  let result = await Plane.find(query);
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;