const SensorService = require('./sensorService');

const onActivate = async (req, res) => {
  let result = await SensorService.activate(req.params.label, req.params.activate);
  result = JSON.stringify(result);
  res.send(result);
};

module.exports = {
  onActivate
};