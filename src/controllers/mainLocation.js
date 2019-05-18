const express = require('express');
const router = express.Router();
const MainLocation = require('../models/mainLocation');
const SubLocation = require('../models/subLocations');
const { validate } = require('../utilis/validator');

router.get('/', async (req, res) => {
  try {
    const populationRecord = await MainLocation.find().sort('locationName');
    res.send(populationRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { locationName, numberOfFemale, numberOfMale } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const locations = await PopulationRecord.findOne({locationName})
    // if (locations) return res.status(409).json({ message: "This location already exists" })

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
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const populationRecord = await MainLocation.findByIdAndUpdate(
      req.params.id,
      {
        locationName: req.body.locationName,
        numberOfFemale: req.body.numberOfFemale,
        numberOfMale: req.body.numberOfMale
      },
      { new: true }
    );

    if (!populationRecord)
      return res.status(404).send('Location with the given ID was not found.');

    res.status(200).send(populationRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const populationRecord = await MainLocation.findByIdAndRemove(
      req.params.id
    );

    if (!populationRecord)
      return res.status(404).send('Location with the given ID was not found.');

    res.send(populationRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const populationRecord = await MainLocation.findById(req.params.id);
    console.log('*******', populationRecord.subLocation);

    if (!populationRecord) {
      console.log('nooooooooooooo')
      return res
        .status(404)
        .json({ message: 'Location with the given ID was not found.' });
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
});

module.exports = router;
