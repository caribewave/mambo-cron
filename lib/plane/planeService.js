const Plane = require('./plane').planeModel;

const save = async (obj) => {
  if (obj.lat && obj.lon && obj.hex) {
    let plane = new Plane(obj);
    plane.location.coordinates = [obj.lat, obj.lon];
    plane.save();
  }
};

const findByBbox = async (bbox) => {
      let ne = [bbox[3], bbox[2]];
      let sw = [bbox[1], bbox[0]];

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
                    value: "$location.coordinates",
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
  let query = [{
    $addFields: {
      coordinates: "$location.coordinates"
    }
  }];
  return await Plane.aggregate(query)
      ;
};


module.exports = {
  save,
  findByBbox,
  findAll,
  find
};