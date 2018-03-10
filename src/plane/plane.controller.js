const express = require('express');
const planeService = require('./plane.service');

let app = express();


async function onGetAll(req, res) {
  let result = await planeService.findAll();
  result = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.end(result);
}

async function onGetLoc(req, res) {
  let bboxParam = req.query.bbox;

  let bbox = bboxParam.replace("(", "");
  bbox = bbox.replace(")", "");
  bbox = bbox.split(",");
  bbox.forEach((coord, i) => {
    bbox[i] = Number.parseFloat(coord);
  });

  let result;

  result = await planeService.findByBbox(bbox);
  result = JSON.stringify(result);
  res.end(result);
}

app.get('/all', onGetAll);
app.get('/loc', onGetLoc);

module.exports = app;