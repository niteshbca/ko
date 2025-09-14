# Production Management Integration Guide

## Overview
This guide explains how the frontend ProductionManagement component is connected to the backend API for data storage and retrieval.

## Features Implemented

### 1. Frontend-Backend Connection
- ✅ Form data is sent to backend API endpoint: `http://localhost:5000/api/production`
- ✅ Proper error handling and user feedback
- ✅ Form validation and required field checks

### 2. Automatic Downtime Calculation
- ✅ When "From" and "To" time fields are filled, downtime is automatically calculated
- ✅ Handles cross-midnight scenarios (e.g., 23:00 to 07:00 = 8 hours)
- ✅ Displays result in "Downtime(hours and minute)" field as read-only

### 3. Form State Management
- ✅ All form fields are controlled components with React state
- ✅ Form resets after successful submission
- ✅ Loading state during submission

## How to Test

### 1. Start Backend Server
```bash
cd BeSpokeByte/backend
npm start
```

### 2. Start Frontend
```bash
cd BeSpokeByte/web-task
npm run dev
```

### 3. Test the Form
1. Navigate to the Production Management page
2. Fill in the form fields:
   - Select a date
   - Choose shift (Day/Night)
   - Enter particulars
   - Set From and To times (downtime will auto-calculate)
   - Select main detail and sub detail
   - Enter detail value
3. Click "Submit Data"
4. Check browser console and backend logs for confirmation

### 4. Test API Directly
```bash
cd BeSpokeByte
node test-production-api.js
```

## Data Flow

1. **User Input** → Form state updates
2. **Time Calculation** → useEffect calculates downtime automatically
3. **Form Submit** → POST request to `/api/production`
4. **Backend Validation** → Checks required fields
5. **Database Save** → MongoDB stores the data
6. **Response** → Success/error message to user

## API Endpoints

- `GET /api/production` - Retrieve all production data
- `POST /api/production` - Create new production record
- `PUT /api/production/:id` - Update existing record
- `DELETE /api/production/:id` - Delete record

## Database Schema

```javascript
{
  dates: String (required),
  shift: String,
  particulars: String,
  from_time: String,
  to_time: String,
  downtime: String (auto-calculated),
  main_detail: String,
  sub_detail: String,
  detail_value: Number
}
```

## Troubleshooting

- **CORS Error**: Make sure backend has CORS enabled
- **Network Error**: Verify backend server is running on port 5000
- **Database Error**: Check MongoDB connection in backend
- **Form Not Submitting**: Check browser console for validation errors

