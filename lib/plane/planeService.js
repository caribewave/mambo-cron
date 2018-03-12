const Plane = require('./plane').planeModel;

const save = async (obj) => {
  if (obj.lat && obj.lon && obj.hex) {
    let plane = new Plane(obj);
    plane.location.coordinates = [obj.lon, obj.lat];
    plane.save();
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
          $group: {
            _id: "$hex",
            coordinates:
                {
                  $push: {
                    value: ["$location.coordinates"],
                    time: "$updated_at"
                  }
                },
            lastSpeed: {$last: "$speed"},
            direction: {$last: "$track"}
          },
        }
      ];


      let result = {};
      result.bboxRequested = bbox;
      result.points = await Plane.aggregate(aggregate);
      return result;
    }
;

const findAll = async () => {
  return await Plane.find({});
};

const find = async (hex) => {
      let query = [
        {
          $match: {hex: hex}
        }
      ];

      return await
          Plane.aggregate(query);
    }
;


module.exports = {
  save,
  findByBbox,
  findAll,
  find
};