const Boat = require('./boat');

const mock = {
  hex: "1234ax",
  location: {
    coordinates: ["", Number]
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
  return mock;
};

const save = async (boat) => {
  //TODO : implement method
  return boat;
};

const update = async (boat) => {
  //TODO : implement method
  if (boat.label === mock.label) {
    return boat;
  }
};

module.exports = {
  findAll,
  find,
  save,
  update
};