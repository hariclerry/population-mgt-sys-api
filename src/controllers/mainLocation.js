const mongoose = require('mongoose');
const MainLocation = require('../models/mainLocation');
const { validate } = require('../utilis/validator');

/**
 * @swagger
 * /Creat Location:
 *   post:
 *     tags:
 *       - Locations
 *     name: Create
 *     summary: Creates location
 *     consumes:
 *       - application/json
 *     parameters:
 *       - locationName: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/MainLocation'
 *           type: object
 *           properties:
 *              locationName:
 *                 type: string
 *              numberOfFemale:
 *                 type: integer
 *              numberOfMale:
 *                 type: integer
 *              subLocation:
 *                 type: array
 *              total:
 *                type: integer
 *           required:
 *             - locationName
 *             - numberOfFemale
 *             - numberOfMale
 *             - total
 *     responses:
 *       201:
 *         description: Location created successfully
 */

module.exports = {
  async fetchAllLocations(req, res) {
    try {
      const populationRecord = await MainLocation.find().sort('locationName');
      res.send(populationRecord);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async createLocation(req, res) {
    try {
      const { locationName, numberOfFemale, numberOfMale } = req.body;
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const locations = await MainLocation.findOne({locationName})
      if (locations) return res.status(409).json({ message: `Location with name ${locationName} already exists`})

      let populationRecord = new MainLocation({
        locationName,
        numberOfFemale,
        numberOfMale
      });
      populationRecord.total =
        parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10);

      const savedPopulation = await populationRecord.save();

      res.status(201).send(savedPopulation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async updateLocation(req, res) {
    try {
      const { locationName, numberOfFemale, numberOfMale} = req.body
      const { locationId } = req.params
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      if (!mongoose.Types.ObjectId.isValid(locationId)){
        return res.status(400)
          .send({message: `Invalid location ID`});
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
        .send({message: `Location with ID ${locationId} was not found`});
      }

      res.status(200).send(savedPopulation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async deleteLocation(req, res) {
    const { locationId } = req.params
    try {
      if (!mongoose.Types.ObjectId.isValid(locationId)){
        return res.status(400)
          .send({message: `Invalid location ID`});
      }
      const populationRecord = await MainLocation.findByIdAndRemove(locationId);

      if (!populationRecord)
        return res
          .status(404)
          .send({message: `Location with ID ${locationId} was not found`});

      res.status(200).send({message: `Location with ID ${locationId} deleted successfully`});
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async fetchLocation(req, res) {
    const { locationId } = req.params
    try {
      if (!mongoose.Types.ObjectId.isValid(locationId)){
        return res.status(400)
          .send({message: `Invalid location ID`});
      }
      const populationRecord = await MainLocation.findById(locationId);

      if (!populationRecord.id) {
        return res
          .status(404)
          .send({message: `Location with ID ${locationId} was not found`});
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
      res.send(populationRecord);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
