const Plane = require('./plane').planeModel;

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
            lastSpeed: {$last: "$speed"},
            direction: {$last: "$track"},
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


      let result = {};
      result.bboxRequested = bbox;
      result.points = await
          Plane.aggregate(aggregate);
      return result;
    }
;

const findAll = async () => {
  return await Plane.find({});
};

const find = async (hex) => {
      let query = {
        hex: hex
      };

      return await
          Plane.find(query);
    }
;


module.exports = {
  save,
  findByBbox,
  findAll,
  find
};