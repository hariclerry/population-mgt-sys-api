const express = require('express');
const router = express.Router();
const PopulationRecord = require('../models/population');
const { validate } = require('../utilis/validator');

router.get('/', async (req, res) => {
  try {
    const populationRecord = await PopulationRecord.find().sort('locationName');
    // const xyz =  await PopulationRecord.find().select({numberOfFemale:1}).count()
    // console.log('%%%%%%%%%%',xyz)
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
    
    const locations = await PopulationRecord.findOne({locationName})
    if (locations) return res.status(409).json({ message: "This location already exists" })

    let populationRecord = new PopulationRecord({
      locationName, numberOfFemale, numberOfMale
    });
    populationRecord.total = parseInt(numberOfFemale, 10) + parseInt(numberOfMale, 10)

    // const savedLocation = await newLocation.save()
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

    const populationRecord = await PopulationRecord.findByIdAndUpdate(
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
    const populationRecord = await PopulationRecord.findByIdAndRemove(
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
    const populationRecord = await PopulationRecord.findById({ _id: id });

    if (!populationRecord) return res.status(404).send('Location with the given ID was not found.');

    res.send(populationRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
