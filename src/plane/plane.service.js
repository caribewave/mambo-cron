const Plane = require('./plane');

const PlaneService = {
  async save(obj) {
    if (obj.lat && obj.lon && obj.hex) {
      let plane = await this.find(obj.hex, obj.lat, obj.lon);

      if (plane.length === 0) {
        plane = new Plane(obj);
        plane.location.coordinates = [obj.lat, obj.lon];

        plane.save();
      }
    }
  },

  async findByBbox(bbox) {
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
          coordinates: {$push: "$location.coordinates"},
        }
      }
    ];


    let result = {};
    result.bboxRequested = bbox;
    result.points = await Plane.aggregate(aggregate);
    return result;
  },

  async findAll() {
    return await Plane.find({});
  }
};

module.exports = PlaneService;