'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');

const { User } = require('../models/user');

router.use(bodyParser.json());


// GET USER QUESTIONS
router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      res.json(user.questions);
    })
});

