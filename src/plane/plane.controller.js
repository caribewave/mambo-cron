const express = require('express');
const Plane = require('./Plane');

let app = express();


function onGetAll(req, res) {
  Plane.find({}, (err, results) => {
    planes = results;
    res.end(JSON.stringify(planes));
  });

}

async function onGetLoc(req, res) {
  let bboxParam = req.query.bbox;

  let bbox = bboxParam.replace("(", "");
  bbox = bbox.replace(")", "");
  bbox = bbox.split(",");
  bbox.forEach((coord, i) => {
    bbox[i] = Number.parseFloat(coord);
  });

  let ne = [bbox[2], bbox[3]];
  let sw = [bbox[0], bbox[1]];

  bbox = [sw, ne];

  let aggregate = [
    {
      $match: {
        location: {
          $geoWithin: {
            $box: bbox
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


  let result = {};
  result.bboxRequested = bbox;
  result.points = await Plane.aggregate(aggregate);


  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;