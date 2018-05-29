'use strict';
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }, 
  // memoryValue: { type: Number, default: 1 } 
});


module.exports = mongoose.model('Question', questionSchema);