const Sensor = require('./sensor').sensorModel;
const FlightCron = require('../cron/flightCron');

const findAll = async () => {
  return await Sensor.find();
};

const save = async (sensorParam) => {
  let sensor = new Sensor(sensorParam);

  try {
    await sensor.save();
    sensor.source = Buffer.from(sensor.source, 'base64')
                          .toString();
    if (sensor.activated) {
      FlightCron.launchCron(sensor);
    }
  } catch (e) {
    throw e;
  }
  return sensor;
};

const remove = async (label) => {
  await Sensor.remove({label: label});
  await FlightCron.destroyCron(label);
};

const findByLabel = async (label) => {
  return await Sensor.find({
    label: label
  });
};

const activate = async (label, activate) => {
  let sensor;
  try {
    sensor = await Sensor.findOneAndUpdate({label: label}, {activated: activate}, {new: true});
    if (sensor.activated) {
      FlightCron.launchCron(sensor);
    } else {
      FlightCron.destroyCron(sensor.label);
    }
  } catch (e) {
    console.log(e);
  }

  return sensor;
};

const edit = async (label, sensor) => {
  return await Sensor.findOneAndUpdate({label: label}, {
    $set: {
      label: sensor.label,
      activated: sensor.activated,
      source: sensor.source,
      type: sensor.type
    }
  }, {new: true});
};

const findByBbox = async (bbox) => {
  let ne = [bbox[2], bbox[3]];
  let sw = [bbox[0], bbox[1]];

  bbox = [sw, ne];

  let aggregate = [
    {
      $match: {
        location: {
          $geoWithin: {
            $box: bbox
          }
        }
      }
    }
  ];


  return await Sensor.aggregate(aggregate);
};


module.exports = {
  findAll,
  findByLabel,
  findByBbox,
  save,
  remove,
  activate,
  edit
};