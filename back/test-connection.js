// Test script to verify backend connection and add sample data
const mongoose = require('mongoose');
const ProductionData = require('./models/ProductionData');
const CalculationHistory = require('./models/CalculationHistory');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bespokebyte', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test ProductionData model
    const productionCount = await ProductionData.countDocuments();
    console.log(`Production data records: ${productionCount}`);
    
    // Test CalculationHistory model
    const calculationCount = await CalculationHistory.countDocuments();
    console.log(`Calculation history records: ${calculationCount}`);
    
    // Add sample production data if none exists
    if (productionCount === 0) {
      console.log('Adding sample production data...');
      const sampleData = [
        {
          progress: "Approved",
          date: "29-07-2025",
          shift: "Day",
          particulars: "Composition",
          fromTime: "01:03:00 PM",
          toTime: "02:03:00 PM",
          downtime: "1h 0m",
          mainDetails: "By Other",
          subDetails: "Material Burning in Die",
          detail_value: 60
        },
        {
          progress: "Unapproved",
          date: "20-07-2025",
          shift: "Day",
          particulars: "Plant Heating Time Token",
          fromTime: "08:00:00 AM",
          toTime: "09:30:00 AM",
          downtime: "1h 30m",
          mainDetails: "By Other",
          subDetails: "Plant over heating",
          detail_value: 90
        },
        {
          progress: "Approved",
          date: "20-07-2025",
          shift: "Night",
          particulars: "Plant Heating Time Token",
          fromTime: "04:30:00 AM",
          toTime: "08:00:00 AM",
          downtime: "3h 30m",
          mainDetails: "By Employee",
          subDetails: "Power OFF",
          detail_value: 210
        }
      ];
      
      await ProductionData.insertMany(sampleData);
      console.log('Sample production data added successfully!');
    }
    
    // Add sample calculation history if none exists
    if (calculationCount === 0) {
      console.log('Adding sample calculation history...');
      const sampleCalculations = [
        {
          date: "29/07/2025",
          time: "02:30:15 PM",
          multiplier: 1.5
        },
        {
          date: "20/07/2025",
          time: "10:15:30 AM",
          multiplier: 2.0
        }
      ];
      
      await CalculationHistory.insertMany(sampleCalculations);
      console.log('Sample calculation history added successfully!');
    }
    
    console.log('Database connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection();

