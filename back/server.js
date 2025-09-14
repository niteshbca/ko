require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const employeeRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');
const detailsRoutes = require('./routes/details');
const productionRoutes = require('./routes/production');
const calculationHistoryRoutes = require('./routes/calculationHistory');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api', authRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/calculation-history', calculationHistoryRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));