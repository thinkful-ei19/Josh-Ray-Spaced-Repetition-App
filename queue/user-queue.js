'use strict';

const Queue = require('./queue-class');
const { User } = require('../models/user');

const User = new Queue();

User.questions.map(question = User.enqueue(question));

function peek(queue) {
  let currNode = queue.first;
  let displayQueue = currNode.value;
  return displayQueue;
};

module.exports = {User, peek};