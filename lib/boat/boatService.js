const Boat = require('./boat');

let id = 0;
let mock = [{
  hex: id,
  location: {
    coordinates: [-61.3010699, 15.9368839]
  },
  time: new Date(),
  label: "sample"
}];


const findAll = async () => {
  //TODO : implement method
  return mock;
};

const find = async (hex) => {
  //TODO : implement method
  for (let i in mock) {
    if (mock[i].hex === boat.hex) {
      return mock[i];
    }
  }
};

const save = async (boat) => {
  //TODO : implement method
  boat.hex = ++id;
  mock.push(boat);
  return boat;
};

const update = async (boat) => {
  //TODO : implement method
  for (let i in mock) {
    if (mock[i].hex === boat.hex) {
      mock[i] = boat;
      return mock[i];
    }
  }
};

const remove = async (hex) => {
  for (let i in mock) {
    if (mock[i].hex === Number.parseInt(hex)) {
      mock.splice(i, 1);
      return hex;
    }
  }
};

const findByBbox = async (bbox) => {
  //TODO : implement method
  let result = [];
  for (let i in mock) {
    let m = mock[i];
    result.push({
      _id: m.hex,
      lastSpeed: 0,
      direction: 43,
      coordinates: [{
        value: m.location.coordinates,
        time: new Date()
      }]
    })
  }

  return result;
};

module.exports = {
  findAll,
  find,
  findByBbox,
  save,
  update,
  remove
};