// Test script for Production API
const fetch = require('node-fetch');

const testData = {
  dates: '2024-01-15',
  shift: 'day',
  particulars: 'Test production data',
  from_time: '09:00',
  to_time: '17:00',
  downtime: '08:00',
  main_detail: 'By Employee',
  sub_detail: 'Mechanical',
  detail_value: 8
};

async function testProductionAPI() {
  try {
    console.log('Testing Production API...');
    
    // Test POST request
    const response = await fetch('http://localhost:5000/api/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ POST request successful:', result);
    } else {
      const error = await response.json();
      console.log('❌ POST request failed:', error);
    }
    
    // Test GET request
    const getResponse = await fetch('http://localhost:5000/api/production');
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET request successful. Records count:', data.length);
    } else {
      console.log('❌ GET request failed');
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

testProductionAPI();

