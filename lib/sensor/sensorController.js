const SensorService = require('./sensorService');
const PlaneService = require('../plane/planeService');
const BoatService = require('../boat/boatService');
const BboxParser = require('../utils/bboxParser');

const onGetAll = async (req, res) => {
  let sources = req.query.source;
  let bboxRequested = req.query.bbox;
  let result = {};

  if (!bboxRequested) {
    res.send('');
  }

  bboxRequested = BboxParser.parse(bboxRequested);
  result.bboxRequested = bboxRequested;
  if (!sources) {
    res.send('');
  }

  for(let i in sources){
    switch (sources[i]) {
      case 'plane':
        result.planes = await PlaneService.findByBbox(bboxRequested);
        break;
      case 'boat':
        result.boats = await BoatService.findByBbox(bboxRequested);
        break;
      case 'sensor':
        result.sensors = await SensorService.findByBbox(bboxRequested);
        break;
    }
  }

  result = JSON.stringify(result);

  res.send(result);
};

const onPost = async (req, res) => {
  let result;

  try {
    result = await SensorService.save(req.body);
  } catch (e) {
    let message;
    switch (e.code) {
      case 11000:
        message = "Sensor with this source already exist.";
        break;
    }
    res.status(400)
       .send({
         message: message
       });
  }

  res.send(JSON.stringify(result));
};

const onGet = async (req, res) => {

  let result;

  switch (req.params.source) {
    case 'planes' :
      result = await PlaneService.find(req.params.id);
      break;
    case 'sensors':
      result = await SensorService.findByLabel(req.params.id);
      break;
    case 'boats' :
      result = await BoatService.find(req.params.id);
      break;
  }

  result = JSON.stringify(result);
  res.send(result);
};

const onDelete = async (req, res) => {
  await SensorService.remove(req.params.label);
  res.send(req.params.label);
};

const onActivate = async (req, res) => {
  let result = await SensorService.activate(req.params.label, req.params.activate);
  result = JSON.stringify(result);
  res.send(result);
};

const onEdit = async (req, res) => {
  let sensor = await SensorService.edit(req.params.label, req.body);
  let result = {
    sensor: sensor,
    editLabel: req.params.label
  };
  result = JSON.stringify(result);
  res.send(result);
};

const onGetLoc = async (req, res) => {
  let bbox = BboxParser.parse(req.query.bbox);
  let sensors = await SensorService.findByBbox(bbox);

  let result = {
    sensors: sensors,
    bboxRequested: bbox
  };

  result = JSON.stringify(result);
  res.send(result);
};


module.exports = {
  onGetAll,
  onPost,
  onGet,
  onDelete,
  onActivate,
  onEdit,
  onGetLoc
};