const SensorService = require('./sensorService');
const BboxParser = require('../utils/bboxParser');

const onGetAll = async (req, res) => {
  let result = await SensorService.findAll();
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
  let result = await SensorService.findByLabel(req.params.label);
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