const express = require('express');
const router = express.Router();
const PopulationRecord = require('../models/population');
const { validate } = require('../utilis/validator');

router.get('/', async (req, res) => {
  try {
    const populationRecord = await PopulationRecord.find().sort('locationName');
    res.send(populationRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let populationRecord = new PopulationRecord({
      locationName: req.body.locationName,
      numberOfFemale: req.body.numberOfFemale,
      numberOfMale: req.body.numberOfMale
    });
    populationRecord = await populationRecord.save();

    res.status(201).send(populationRecord);
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
    // if (!populationRecord) {
    //   return console.log('%%%%%%%%%%%%%%%%%%%%%%');
    // }

    if (!populationRecord) return res.status(404).send('Location with the given ID was not found.');

    res.send(populationRecord);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
