const SensorService = require('../sensor/sensorService');
const PlaneService = require('../plane/planeService');
const BoatService = require('../boat/boatService');
const BboxParser = require('../utils/bboxParser');

const services = [];

services['planes'] = PlaneService;
services['boats'] = BoatService;
services['sensors'] = SensorService;

const onGetLoc = async (req, res) => {
  let sources = req.query.source;
  let bboxRequested = req.query.bbox;
  let result = {};

  if (!bboxRequested) {
    res.status(400);
    res.send({
      message: 'Bounding box is requested.'
    });
  }

  bboxRequested = BboxParser.parse(bboxRequested);
  result.bboxRequested = bboxRequested;

  if (!sources) {
    res.status(400);
    res.send({
      message: 'You must provide at least one source.'
    });
  }

  result.features = {};

  if(!Array.isArray(sources)){
    sources = [sources];
  }

  for (let i in sources) {
    let source = sources[i];
    result.features[source] = await services[source].findByBbox(bboxRequested);
  }

  result = JSON.stringify(result);
  res.send(result);
};

const onGet = async (req, res) => {

  let result;

  result = await services[req.params.source].find(req.params.id);
  result = JSON.stringify(result);
  res.send(result);
};

const onDelete = async (req, res) => {
  let source = req.params.source;
  let label = req.params.label;

  if (!source) {
    //TODO : create error message
    res.send({
      message: "Source is undefined."
    });
  }

  if (!label) {
    //TODO : create error message
    res.send({
      message: "Label is undefined."
    });
  }

  let result = await services[source].remove(label);
  res.send(result);
};

const onEdit = async (req, res) => {
  let feature = await services[req.params.source].edit(req.params.id, req.body);
  let result = {
    feature: feature,
    editLabel: req.params.id
  };
  result = JSON.stringify(result);
  res.send(result);
};

const onGetAll = async (req, res) => {
  res.send('');
  // let bbox = BboxParser.parse(req.query.bbox);
  // let sensors = await SensorService.findByBbox(bbox);
  //
  // let result = {
  //   sensors: sensors,
  //   bboxRequested: bbox
  // };
  //
  // result = JSON.stringify(result);
  // res.send(result);
};

const onPost = async (req, res) => {
  let result;

  try {
    result = await services[req.params.source].save(req.body);
  } catch (e) {
    let message;
    switch (e.code) {
      case 11000:
        message = "Sensor with this source already exidst.";
        break;
    }
    res.status(400)
       .send({
         message: message
       });
  }

  res.send(JSON.stringify(result));
};

module.exports = {
  onGet,
  onGetAll,
  onGetLoc,
  onDelete,
  onEdit,
  onPost
};
