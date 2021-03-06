/**
 * @file creates the main location schema
 */

// Third party imports
const mongoose = require('mongoose');

// constants
const Schema = mongoose.Schema;

// create schema
const subLocationSchema = Schema({
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
  subTotal: {
    type: Number,
    required: true,
  },
  parentLocation: {
    type: Schema.Types.ObjectId,
    ref: 'MainLocation'
  } ,
  created: { 
    type: Date,
    default: Date.now
}
});

//create model using schema
const SubLocation = mongoose.model('SubLocation', subLocationSchema)

module.exports = subLocationSchema;
module.exports = SubLocation;
