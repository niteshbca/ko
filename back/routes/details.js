const express = require('express');
const router = express.Router();
const Details = require('../models/Details');

// Add main detail
router.post('/main', async (req, res) => {
  try {
    const { main_detail } = req.body;
    const detail = new Details({ main_detail });
    await detail.save();
    res.status(201).json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit main detail
router.put('/main', async (req, res) => {
  try {
    const { old_main_detail, new_main_detail } = req.body;
    const detail = await Details.findOneAndUpdate(
      { main_detail: old_main_detail },
      { main_detail: new_main_detail },
      { new: true }
    );
    res.json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete main detail
router.delete('/main', async (req, res) => {
  try {
    const { main_detail } = req.body;
    await Details.deleteMany({ main_detail });
    res.json({ message: 'Main detail(s) deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add sub detail
router.post('/sub', async (req, res) => {
  try {
    const { main_detail, sub_detail } = req.body;
    const detail = new Details({ main_detail, sub_detail });
    await detail.save();
    res.status(201).json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit sub detail
router.put('/sub', async (req, res) => {
  try {
    const { main_detail, old_sub_detail, new_sub_detail } = req.body;
    const detail = await Details.findOneAndUpdate(
      { main_detail, sub_detail: old_sub_detail },
      { sub_detail: new_sub_detail },
      { new: true }
    );
    res.json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete sub detail
router.delete('/sub', async (req, res) => {
  try {
    const { main_detail, sub_detail } = req.body;
    await Details.deleteOne({ main_detail, sub_detail });
    res.json({ message: 'Sub detail deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch all main details
router.get('/main', async (req, res) => {
  try {
    const mainDetails = await Details.find({ sub_detail: '' }).distinct('main_detail');
    res.json(mainDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch sub details for a main detail
router.get('/sub/:main_detail', async (req, res) => {
  try {
    const { main_detail } = req.params;
    const subDetails = await Details.find({ main_detail, sub_detail: { $ne: '' } }).distinct('sub_detail');
    res.json(subDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 