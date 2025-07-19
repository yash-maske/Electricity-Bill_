import express from 'express';
import BillModel from '../models/Bill.js'; // ensure .js if using ESModules

const router = express.Router();

router.post('/save', async (req, res) => {
  try {
    const { current_units } = req.body;

    if (!current_units || isNaN(current_units)) {
      return res.status(400).json({ error: 'Invalid or missing current_units' });
    }

    // Get the last saved bill to fetch last_reading
    const lastBill = await BillModel.findOne().sort({ timestamp: -1 });

    const last_reading = lastBill ? lastBill.current_units : 1000;
    const units_used = current_units - last_reading;
    const total_bill = units_used * 12;

    // Create and save new bill
    const newBill = new BillModel({
      current_units,
      last_reading,
      total_bill
    });

    await newBill.save();

    res.status(201).json({
      message: 'Bill saved successfully',
      data: newBill
    });

  } catch (err) {
    console.error('Error saving bill:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Insert fake initial data
router.post('/insert-fake', async (req, res) => {
  try {
    const fakeBill = new BillModel({
      current_units: 1000,
      last_reading: 900,
      total_bill: 1200 // (1000 - 900) * 12
    });

    await fakeBill.save();

    res.status(201).json({
      message: 'Fake bill inserted successfully',
      data: fakeBill
    });
  } catch (err) {
    console.error('Error inserting fake bill:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-bill', async (req, res) => {
  try {
    const allBills = await BillModel.find().sort({ timestamp: -1 }); // Newest first
    res.status(200).json({
      message: 'All bills fetched successfully',
      data: allBills
    });
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
