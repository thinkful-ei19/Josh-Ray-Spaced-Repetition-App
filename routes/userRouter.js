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
  User.findById(req.user.id)
    .populate('questions')
    .then(user => {
      user.questions.map(question => questionQueue.enqueue(question));
      res.json(peek(questionQueue));
    })
});


// ON CORRECT OR INCORRECT ANSWER, WILL EITHER REMOVE QUESTION FROM QUEUE OR PUT IN THE BACK OF QUEUE
router.put('/questions', (req, res, next) => {
  const userId = req.user.id;
  const submitAnswer = req.body.value.toLowerCase();
  const correctAnswer = questionQueue.first.value.answer.toLowerCase();

  // IF CORRECT ANSWER
  // * remove question from queue
  if(submitAnswer === correctAnswer) {    // * NOTE: Need to refactor together with User schema to eliminate double manipulation for Queue and User question Array
    let currNode = questionQueue.first;
      questionQueue.enqueue(currNode.value);
      currNode = currNode.prev;
      questionQueue.dequeue()
 
    User.findByIdAndUpdate(userId) 
      .then(user => {
        user.questions.push(user.questions[0])
        user.questions.shift()
        user.correct++
        user.save(err => {
          if(err) {
            res.send(err);
          }
          let responseObj = peek(questionQueue);
          responseObj = responseObj.toObject();
          responseObj.correct = user.correct;
          res.json(responseObj);
        })
      })
  }

  // IF INCORRECT ANSWER
  // * move current question to back of the queue and move 2nd question in queue into the 1st position
  if(submitAnswer !== correctAnswer) {
    let currNode = questionQueue.first;
    questionQueue.enqueue(currNode.value);
    currNode = currNode.prev;
    questionQueue.dequeue();
    
    User.findByIdAndUpdate(userId)
    .then(user => {
      user.questions.push(user.questions[0])
      user.questions.shift()
      user.incorrect++
      user.save(err => {
        if(err) {
          res.send(err);
        }
        let responseObj = peek(questionQueue);
        responseObj = responseObj.toObject();
        responseObj.incorrect = user.incorrect;
        res.json(responseObj);
      })
    })
  }
});

module.exports = router;