'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require('../models/question');

router.get('/questions', (req, res, next) => {
  Question.find()
    .then(results => {
      res.json(results);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/questions/:id', (req, res, next) => {
  const {id} = req.params;
  Question.findOne({_id: id})
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;