'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');

const { User } = require('../models/user');

router.use(bodyParser.json());


// GET USER QUESTIONS
router.get('/questions', (req, res, next) => {
  // console.log(req.user);
  User.findById(req.user.id)
    .populate('questions')
    .then(user => {
      console.log(user);
      res.json(user.questions);
    })
});


module.exports = router;