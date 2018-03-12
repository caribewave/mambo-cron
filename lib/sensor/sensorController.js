const SensorService = require('./sensorService');

const onGetAll = async (req, res) => {
  let result = SensorService.findAll();
  result = JSON.stringify(result);

  res.setHeader('Content-Type', 'application/json');
  res.send(result);
};

const onPost = async (req, res) => {
  let result = await SensorService.save(req.body);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
};

const onGet = async (req, res) => {
  let result = await SensorService.findByLabel(req.params.label);
  result = JSON.stringify(result);

  res.setHeader('Content-Type', 'application/json');
  res.send(result);
};

module.exports = {
  onGetAll,
  onPost,
  onGet
};