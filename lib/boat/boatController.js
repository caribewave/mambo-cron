const BoatService = require('./boatService');

const onGetAll = async (req, res) => {
  let result = await  BoatService.findAll();
  result = JSON.stringify(result);
  res.send(result);
};

const onGet = async (req, res) => {
  let result = await BoatService.find(req.params.hex);
  result = JSON.stringify(result);
  res.send(result);
};

const onPost = async (req, res) => {
  let result = await BoatService.save(req.body);
  result = JSON.stringify(result);
  res.send(result);
};

const onPut = async (req, res) => {
  let result = await BoatService.update(req.body);
  result = JSON.stringify(result);
  res.send(result);
};

const onDelete = async (req, res) => {
  let result = await BoatService.delete(req.params.hex);
  result = JSON.stringify(result);
  res.send(result);
};

module.exports = {
  onGetAll,
  onGet,
  onPost,
  onPut,
  onDelete
};