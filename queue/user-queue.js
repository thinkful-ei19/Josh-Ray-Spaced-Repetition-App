'use strict';

const Queue = require('./queue-class');
const { User } = require('../models/user');

const UserQueue = new Queue();

User.questions.question.map(question = UserQueue.enqueue(question));

function peek(queue) {
  let currNode = queue.first;
  let displayQueue = currNode.value;
  return displayQueue;
};

module.exports = {UserQueue, peek};