/**
 * @file contains all endpoints for location
 * creates, updates, fetches and deletes location
 */

//Third party imports
const mongoose = require('mongoose');

// local imports
const MainLocation = require('../models/mainLocation');
const { validate } = require('../utilis/validator');

module.exports = {
  /**
   * @function fetchAllLocations
   * called when fetching all location
   */
  async fetchAllLocations(req, res) {
    try {
      const populationRecord = await MainLocation.find().sort('locationName');
      res.status(200).send({data: populationRecord, status: 'Success'});
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function createLocation
   * called when creating a new location
   */
  async createLocation(req, res) {
    try {
      const { locationName, numberOfFemale, numberOfMale } = req.body;
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const locations = await MainLocation.findOne({ locationName });
      if (locations)
        return res
          .status(409)
          .json({
            message: `Location with name ${locationName} already exists`
          });

      let populationRecord = new MainLocation({
        locationName,
        numberOfFemale,
        numberOfMale
      });
      populationRecord.total =
        parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10);

      const savedPopulation = await populationRecord.save();

      res.status(201).send({data: savedPopulation, status: 'Success'});
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function updateLocation
   * called when updating a location
   */
  async updateLocation(req, res) {
    try {
      const { locationName, numberOfFemale, numberOfMale } = req.body;
      const { locationId } = req.params;
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      if (!mongoose.Types.ObjectId.isValid(locationId)) {
        return res.status(400).send({ message: `Invalid location ID` });
      }

      const populationRecord = await MainLocation.findByIdAndUpdate(
        req.params.locationId,
        {
          locationName,
          numberOfFemale,
          numberOfMale
        },
        { new: true }
      );
      populationRecord.total =
        parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10);

      const savedPopulation = await populationRecord.save();

      if (!populationRecord) {
        return res
          .status(404)
          .send({ message: `Location with ID ${locationId} was not found` });
      }

      res.status(200).send({data: savedPopulation, status: 'Success'});
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function deleteLocation
   * called when deleting a location
   */
  async deleteLocation(req, res) {
    const { locationId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(locationId)) {
        return res.status(400).send({ message: `Invalid location ID` });
      }
      const populationRecord = await MainLocation.findByIdAndRemove(locationId);

      if (!populationRecord)
        return res
          .status(404)
          .send({ message: `Location with ID ${locationId} was not found` });

      res
        .status(200)
        .send({
          message: `Location with ID ${locationId} deleted successfully`
        });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  /**
   * @function fetchLocation
   * called when fetching a single location
   */
  async fetchLocation(req, res) {
    const { locationId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(locationId)) {
        return res.status(400).send({ message: `Invalid location ID` });
      }
      const populationRecord = await MainLocation.findById(locationId);

      if (!populationRecord.id) {
        return res
          .status(404)
          .send({ message: `Location with ID ${locationId} was not found` });
      }
      if (populationRecord.subLocation && populationRecord.subLocation.length) {
        populationRecord.total =
          populationRecord.subLocation.reduce((acc, subPopulation) => {
            return acc + subPopulation.subTotal;
          }, 0) +
          populationRecord.numberOfFemale +
          populationRecord.numberOfMale;
      } else {
        populationRecord.total =
          populationRecord.numberOfFemale + populationRecord.numberOfMale;
      }
      res.send({data: populationRecord, status: 'Success'});
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
