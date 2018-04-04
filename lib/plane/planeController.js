const planeService = require('./planeService');
const planeIdService = require('./aircraftInfoService');
const BboxParser = require('../utils/bboxParser');
const Logger = require('../log/Logger')('PlaneCtrl');
const Spinner = Logger.spinner();

const init = async () => {
};

const onGetAll = async (req, res) => {
  let result = await planeService.findAll();
  result = JSON.stringify(result);
  res.end(result);
};

const onGetLoc = async (req, res) => {
  let bbox =  BboxParser.parse(req.query.bbox);

  let result = await planeService.findByBbox(bbox);
  result = JSON.stringify(result);
  res.end(result);
};

const onGet = async(req, res) => {
  let hex = req.params.hex;
  let planes = await planeService.find(hex);
  let data = planeIdService.findAircraftInfo(hex);
  let result = {
    data : planes,
    aircraftInfo : data
  };
  result = JSON.stringify(result);
  res.end(result);
};

module.exports = {
  init,
  onGetAll,
  onGetLoc,
  onGet
};