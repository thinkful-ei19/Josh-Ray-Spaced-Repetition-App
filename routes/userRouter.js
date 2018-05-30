'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');
const { Queue, peek, display } = require('../queue/queue-class');

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


// ON CORRECT OR INCORRECT ANSWER, WILL EITHER REMOVE QUESTION FROM QUEUE OR PUT IN THE BACK OF QUEUE
router.put('/questions', (req, res, next) => {
  // console.log(display(questionQueue));
  if(req.body.correct) {
    questionQueue.dequeue();
  }
  let updatedQuestions = [];
  while(questionQueue.first) {
    updatedQuestions.push(questionQueue.value);
  }
  User.findByIdAndUpdate(user.id, {$set: {questions: userQuestions}})
  res.json(peek(questionQueue));
});

module.exports = router;