const express = require('express');
const router = express.Router();
const SubLocation = require('../models/subLocations');
const MainLocation = require('../models/mainLocation');
const { validate } = require('../utilis/validator');

module.exports = {

  async fetchAllSubLocations(req, res) {
    try {
      const populationRecord = await SubLocation.find().sort('locationName');
      res.send(populationRecord);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async createSubLocation(req, res) {
    try {
      const { locationName, numberOfFemale, numberOfMale } = req.body;
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      
      const locations = await SubLocation.findOne({locationName})
      if (locations) return res.status(409).json({ message: `Location with name ${locationName} already exists`})
  
      let populationRecord = new SubLocation({
        locationName, numberOfFemale, numberOfMale
      });
      populationRecord.subTotal = parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10)
      populationRecord.parentLocation = req.params.locationId
  
      const savedPopulation = await populationRecord.save();
      let location = await MainLocation.findById(req.params.locationId);
  
      location.subLocation.push(savedPopulation);
      location.save();
  
      res.status(201).send(location);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async updateSubLocation(req, res) {
    const { locationName, numberOfFemale, numberOfMale} = req.body
    const { id } = req.params
    try {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      const populationRecord = await SubLocation.findByIdAndUpdate( id,
        {
          locationName,
          numberOfFemale,
          numberOfMale
        },
        { new: true }
      );

      populationRecord.subTotal =
      parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10);

      const savedPopulation = await populationRecord.save();
  
      if (!populationRecord)
        return res.status(404).send({message: `Location with ID ${id} was not found`});
  
        res.status(200).send(savedPopulation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async deleteSubLocation(req, res) {
    const { id } = req.params
    try {
      const populationRecord = await SubLocation.findByIdAndRemove(
        id
      );
  
      if (!populationRecord)
        return res.status(404).send({message: `Location with ID ${id} was not found`});
  
      res.send({message: `Location with ID ${id} deleted successfully`});
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async fetchSubLocation(req, res) {
    const { id } = req.params;
    try {
      const populationRecord = await SubLocation.findById(id);
  
      if (!populationRecord) return res.status(404).send({message: `Location with ID ${id} was not found`});
  
      res.send(populationRecord);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
}
