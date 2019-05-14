const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create schema
const populationSchema = Schema({
  locationName: {
    type: String,
    required: true,
  },
  numberOfFemale: {
    type: Number,
    required: true,
  },
  numberOfMale: {
    type: Number,
    required: true,
  },
  // total: {
  //   type: Number,
  //   required: true,
  // },
  created: { 
    type: Date,
    default: Date.now
}
});

//create model using schema
const PopulationRecord = mongoose.model('Population', populationSchema)

module.exports = PopulationRecord;
