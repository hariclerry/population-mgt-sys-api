// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validateUser, validateLogin } = require('../utilis/validator');

module.exports = {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ email });
      if (user)
        return res.status(400).send({ message: 'User already registered.' });

      user = new User({ name, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      res.status(201).send({
        user: { userId: user._id, Name: user.name, Email: user.email },
        message: 'Successfully registered'
      });
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ email });
      if (!user) return res.status(400).send({message: 'Invalid email or password.'});

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send({message: 'Invalid password.'});

      const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
      res.send({token, message: "Login successful."});
    } catch (error) {
      res.status(500).send({ Error: error.message });
    }
  }
};
