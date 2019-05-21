const mongoose = require('mongoose');
const subLocationSchema   = require('./subLocations').schema

const Schema = mongoose.Schema;

// create schema
const mainLocationSchema = Schema({
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
  total: {
    type: Number,
    required: true,
  },
  subLocation: {
    type: [subLocationSchema]
  },  
  created: { 
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model('MainLocation', mainLocationSchema)
