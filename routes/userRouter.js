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
      user.questions.forEach(question => questionQueue.enqueue(question));
      // console.log(questionQueue);
      // res.json(user.questions);
      res.json(peek(questionQueue));
    })
});


// ON CORRECT OR INCORRECT ANSWER, WILL EITHER REMOVE QUESTION FROM QUEUE OR PUT IN THE BACK OF QUEUE
router.put('/questions', (req, res, next) => {
  // console.log(req.body.value);
  // console.log(questionQueue.first.value.answer);
  const userId = req.user.id;
  const submitAnswer = req.body.value.toLowerCase();
  const correctAnswer = questionQueue.first.value.answer.toLowerCase();

  // IF CORRECT ANSWER
  // * remove question from queue
  if(submitAnswer === correctAnswer) {
    questionQueue.dequeue();
    // console.log(display(questionQueue));

    User.findByIdAndUpdate(userId) 
      .then(user => {
        // console.log(user);
        user.questions.shift()
        user.save(err => {
          if(err) {
            res.send(err);
          }
          res.json(peek(questionQueue));
        })
      })
    
    // res.json(peek(questionQueue));
    // console.log(display(questionQueue));
  }
 
  
  // IF INCORRECT ANSWER
  // * move current question to back of the queue and move 2nd question in queue into the 1st position
  
  // console.log(questionQueue);
  let updatedQuestions = [];
  if(submitAnswer !== correctAnswer) {
    let currNode = questionQueue.first;
    // console.log(currNode);
    questionQueue.enqueue(currNode.value);

    // console.log(questionQueue);
    
    currNode = currNode.prev;
    questionQueue.dequeue();
    
    // console.log(display(questionQueue));
    // while(questionQueue.first.prev !== null) {
    //   currNode = currNode.prev;
    // }
    // console.log(questionQueue);
    
    User.findByIdAndUpdate(userId)
    .then(user => {
      user.questions.push(user.questions[0])
      user.questions.shift()
      user.save(err => {
        if(err) {
          res.send(err);
        }
        res.json(peek(questionQueue));
      })
    })
  }
  // console.log(questionQueue);
  // console.log(req.user.id);

  // User.findByIdAndUpdate(userId, {$set: {questions: updatedQuestions}})
  // res.json(peek(questionQueue));
  

});

module.exports = router;