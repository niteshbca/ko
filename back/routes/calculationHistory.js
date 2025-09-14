const express = require('express');
const router = express.Router();
const CalculationHistory = require('../models/CalculationHistory');

// POST /api/calculation-history
router.post('/', async (req, res) => {
  try {
    const { date, time, multiplier } = req.body;
    const record = new CalculationHistory({ date, time, multiplier });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/calculation-history
router.get('/', async (req, res) => {
  try {
    const records = await CalculationHistory.find().sort({ _id: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 