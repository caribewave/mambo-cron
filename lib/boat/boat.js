const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const boatSchema = new Schema({
  hex : String,
  location : {
    type : {$type : String, default : 'Point'},
    coordinates : [Number, Number ]
  },
  time : Date,
  label : String
});

boatSchema.index({location : '2dsphere'});

const boatModel = mongoose.model('Boat', boatSchema);

module.exports = {
  boatModel
};


