const SensorService = require('./sensorService');

const onGetAll = async (req, res) => {
  let result = await SensorService.findAll();
  result = JSON.stringify(result);

  res.setHeader('Content-Type', 'application/json');
  res.send(result);
};

const onPost = async (req, res) => {
  let result;


  res.setHeader('Content-Type', 'application/json');

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

  res.setHeader('Content-Type', 'application/json');
  res.send(result);
};

const onDelete = async (req, res) => {
  await SensorService.remove(req.params.label);
  res.send(req.params.label);
};

const onActivate = async (req, res) => {
  let result = await SensorService.activate(req.params.label, req.params.activate);
  result = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
};

module.exports = {
  onGetAll,
  onPost,
  onGet,
  onDelete,
  onActivate
};