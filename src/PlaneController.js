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
  let ws = JSON.parse(req.query.ws);
  let ne = JSON.parse(req.query.ne);

  let aggregate = [
    {
      $match: {
        location: {
          $geoWithin: {
            $box: [ws, ne]
          }
        }
      }
    },
    {
      $group: {
        _id: "$hex",
        coordinates: {$push: "$location.coordinates"},
      }
    }
  ];


  let result = await Plane.aggregate(aggregate);
  result.forEach((obj) => {
    obj.origin = {
      ws: ws,
      ne: ne
    };
  });

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;