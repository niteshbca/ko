const mongoose = require('mongoose');

const ProductionDataSchema = new mongoose.Schema({
  dates: { type: String, required: true },
  shift: { type: String },
  particulars: { type: String },
  from_time: { type: String },
  to_time: { type: String },
  downtime: { type: String },
  main_detail: { type: String },
  sub_detail: { type: String },
  detail_value: { type: Number },
  progress: { type: String, default: 'Unapproved' },
});

module.exports = mongoose.model('ProductionData', ProductionDataSchema); 