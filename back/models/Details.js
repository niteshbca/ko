const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  main_detail: { type: String, required: true },
  sub_detail: { type: String, default: '' },
});

module.exports = mongoose.model('Details', DetailsSchema); 