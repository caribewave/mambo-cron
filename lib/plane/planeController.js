const planeService = require('./planeService');

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

  let result;

  result = await planeService.findByBbox(bbox);
  result = JSON.stringify(result);
  res.end(result);
};


module.exports = {
  onGetAll,
  onGetLoc
};