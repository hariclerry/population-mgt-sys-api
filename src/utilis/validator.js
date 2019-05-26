const Joi = require('joi');

function validateRecord(record) {
  const schema = {
    locationName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    numberOfFemale: Joi.number()
      .integer()
      .required(),
    numberOfMale: Joi.number()
      .integer()
      .required()
  };

  return Joi.validate(record, schema);
}
exports.validate = validateRecord;
