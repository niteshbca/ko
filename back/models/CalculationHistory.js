const mongoose = require('mongoose');

const CalculationHistorySchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g. 'MM/DD/YYYY'
  time: { type: String, required: true }, // e.g. 'HH:MM:SS'
  multiplier: { type: Number, required: true }
});

module.exports = mongoose.model('CalculationHistory', CalculationHistorySchema); 