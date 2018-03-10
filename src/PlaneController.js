const express = require('express');
const Plane = require('./Plane');

let app = express();


function onGetAll(req, res) {
  let planes = "test";
  Plane.aggregate(aggregate, (err, results) => {
    planes = results;
    res.end(JSON.stringify(planes));
  });

}

async function onGetLoc(req, res) {
  let lat = Number.parseFloat(req.query.lat) || 0;
  let lng = Number.parseFloat(req.query.lng) || 10000;

  let aggregate = [
    {
      $geoNear: {
        near: {type: "Point", coordinates: [lat, lng]},
        distanceField: "dist.calculated",
        maxDistance: max,
        includeLocs: "dist.location",
        // num: 5,
        spherical: true
      }
    },
    {
      $group: {
        _id: "$hex",
        coordinates: {$push: "$location.coordinates"},
        dist: {$push: "$dist"}
      }
    }
  ];

  let result = await Plane.aggregate(aggregate);
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;