// models/Bill.js
import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  current_units: {
    type: Number,
    required: true
  },
  last_reading: {
    type: Number,
    default: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  total_bill: {
    type: Number,
    default: 0
  }
});

const BillModel = mongoose.model('Bill', BillSchema);
export default BillModel;
