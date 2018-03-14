const planeService = require('./planeService');
const planeIdService = require('./aircraftInfoService');
const Logger = require('../log/Logger')('PlaneCtrl');
const Spinner = Logger.spinner();

const init = async () => {
  Spinner.start('Initializing Aircraft DB');
  await planeIdService.init();
};

const onGetAll = async (req, res) => {
  let result = await planeService.findAll();
  result = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.end(result);
};

const onGetLoc = async (req, res) => {
  let bboxParam = req.query.bbox;

  let bbox = bboxParam.replace("(", "");
  bbox = bbox.replace(")", "");
  bbox = bbox.split(",");
  bbox.forEach((coord, i) => {
    bbox[i] = Number.parseFloat(coord);
  });

  let result = await planeService.findByBbox(bbox);
  result = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.end(result);
};

const onGet = async(req, res) => {
  let hex = req.params.hex;
  let result = await planeService.find(hex);
  let data = planeIdService.findAircraftInfo(hex);
  result.aircraftInfo = data;
  result = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.end(result);
};

module.exports = {
  init,
  onGetAll,
  onGetLoc,
  onGet
};