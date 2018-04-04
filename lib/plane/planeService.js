const Plane = require('./plane').planeModel;
const planeIdService = require('./aircraftInfoService');
const Logger = require('../log/Logger')();
const Spinner = Logger.spinner();

const init = async () => {
  Spinner.start('Initializing Aircraft DB');
  await planeIdService.init();
};

const save = async (obj) => {
  if (obj.lat && obj.lon && obj.hex) {
    let plane = new Plane(obj);
    plane.location.coordinates = [obj.lon, obj.lat];
    plane.updated_at = new Date();

    let lat = plane.location.coordinates[1];
    let lng = plane.location.coordinates[0];
    let hex = plane.hex;


    const query = {
      hex: hex,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 0
        }
      }
    };

    let planes = await Plane.find(query);

    if (planes.length === 0) {
      plane.save();
    }
  }
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
    },
    {
      $sort: {
        updated_at:
            -1
      }
    },
    {
      $group: {
        _id: "$hex",
        lastSpeed: {$first: "$speed"},
        direction: {$first: "$track"},
        coordinates:
            {
              $push: {
                value: "$location.coordinates",
                time: "$updated_at"
              }
            }
      }
    }
  ];


  return Plane.aggregate(aggregate);
};

const findAll = async () => {
  return await Plane.find({});
};

const find = async (hex) => {

  let query = {
    hex: hex
  };

  let data = planeIdService.findAircraftInfo(hex);
  let planes = await Plane.find(query)
                          .sort({updated_at: -1});
  return {
    data: planes,
    aircraftInfo: data
  };

};

const remove = async (hex) => {
  await Plane.remove({
    hex: hex
  });

  return hex;
};


module.exports = {
  init,
  save,
  findByBbox,
  findAll,
  find,
  remove
};