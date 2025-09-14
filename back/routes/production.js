const express = require('express');
const router = express.Router();
const ProductionData = require('../models/ProductionData');

// Get all production data
router.get('/', async (req, res) => {
  try {
    const data = await ProductionData.find().sort({ date: -1 });
    console.log('Fetched production data count:', data.length);
    res.json(data);
  } catch (err) {
    console.error('Error fetching production data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add production data
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received production data:', data);
    
    // Validate required fields
    if (!data.dates) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const prod = new ProductionData(data);
    const savedProd = await prod.save();
    console.log('Saved production data:', savedProd);
    
    res.status(201).json({
      message: 'Production data saved successfully',
      data: savedProd
    });
  } catch (err) {
    console.error('Error saving production data:', err);
    res.status(400).json({ error: err.message });
  }
});

// Edit production data by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProductionData.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Production data not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get sum of detail_value where mainDetails = 'By Employee'
router.get('/sum/by-employee', async (req, res) => {
  try {
    const result = await ProductionData.aggregate([
      { $match: { mainDetails: 'By Employee' } },
      { $group: { _id: null, total_value: { $sum: '$detail_value' } } }
    ]);
    const totalSum = result[0]?.total_value || 0;
    const remainingProduction = totalSum * 160;
    res.json({ totalSum, remainingProduction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete production data by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductionData.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Production data not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 