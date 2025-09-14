const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Employee.findOne({ name: username, password });
    if (user) {
      res.json({ 
        status: 'success', 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.position
        }
      });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router; 