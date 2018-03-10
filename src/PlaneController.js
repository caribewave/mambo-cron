const express = require('express');
const Plane = require('./Plane');

let app = express();


function onGetAll(req, res) {
  Plane.aggregate(aggregate, (err, results) => {
    planes = results;
    res.end(JSON.stringify(planes));
  });

}

async function onGetLoc(req, res) {
  let lat = Number.parseFloat(req.query.lat) || 0;
  let lng = Number.parseFloat(req.query.lng) || 10000;
  let max = Number.parseFloat(req.query.max) || 1000;
  const origin = [lat, lng];

  let aggregate = [
    {
      $geoNear: {
        near: {type: "Point", coordinates: origin},
        distanceField: "dist.calculated",
        includeLocs: "dist.coordinates",
        maxDistance: max,
        spherical: true
      }
    },
    {
      $group: {
        _id: "$hex",
        coordinates: {$push: "$location.coordinates"},
        dist: {$push: "$dist.coordinates"}
      }
    }
  ];

  let result = await Plane.aggregate(aggregate);
  result.forEach((obj) => {
    obj.origin = origin;
  });

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;