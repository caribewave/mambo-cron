const Boat = require('./boat');

const mock = {
  hex: "1234ax",
  location: {
    coordinates: [-61.3010699,15.9368839]
  },
  time: new Date(),
  label: "sample"
};

const findAll = async () => {
  //TODO : implement method
  return [mock];
};

const find = async (hex) => {
  //TODO : implement method
  if(hex === mock.hex){
  return mock;
  }
  return {};
};

const save = async (boat) => {
  //TODO : implement method
  return boat;
};

const update = async (boat) => {
  //TODO : implement method
  if (boat.hex === mock.hex) {
    return boat;
  }
};

module.exports = {
  findAll,
  find,
  save,
  update
};