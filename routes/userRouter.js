'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');
const Queue = require('../queue/queue-class');

router.use(bodyParser.json());

const questionQueue = new Queue();

// GET ALL USER QUESTIONS
// router.get('/questions', (req, res, next) => {
//   // console.log(req.user);
//   User.findById(req.user.id)
//     .populate('questions')
//     .then(user => {
//       console.log(user.questions);
//       res.json(user.questions);
//     })
// });

function peek(queue) {
  let currNode = queue.first;
  let displayQueue = currNode.value;
  return displayQueue;
};


// GET FIRST QUESTION IN QUEUE
router.get('/questions', (req, res, next) => {
  // console.log(req.user);
  User.findById(req.user.id)
    .populate('questions')
    .then(user => {
      // console.log(user.questions);
      user.questions.map(question => questionQueue.enqueue(question));
      // console.log(questionQueue);
      res.json(peek(questionQueue));
    })
});


// router.put('/questions', (req, res, next) => {
//   User.findById(req.user.id)
    
// });

module.exports = router;