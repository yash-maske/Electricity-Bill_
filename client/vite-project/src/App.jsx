import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [currentReading, setCurrentReading] = useState('');
  const [billHistory, setBillHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBillHistory();
  }, []);

  const fetchBillHistory = async () => {
    try {
      const res = await axios.get('https://electricity-bill-l1xdu7kvs-yash-maskes-projects-93f4ac16.vercel.app/api/save/get-bill');
      const bills = res.data.data || [];
      const formattedBills = bills.reverse().map((bill) => ({
        id: bill._id,
        prev: parseInt(bill.last_reading),
        curr: parseInt(bill.current_units),
        unitsUsed: parseInt(bill.current_units) - parseInt(bill.last_reading),
        totalBill: parseInt(bill.total_bill),
        date: new Date(bill.createdAt || bill.timestamp || bill.date).toLocaleDateString() // fallback to available field
      }));
      setBillHistory(formattedBills);
    } catch (err) {
      console.error('Error fetching bill history:', err);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!currentReading || isNaN(parseInt(currentReading))) {
      alert('Enter valid current reading');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://electricity-bill-l1xdu7kvs-yash-maskes-projects-93f4ac16.vercel.app/api/save/save', {
        current_units: parseInt(currentReading),
      });

      const saved = response.data.data;

      const newBill = {
        id: saved._id,
        prev: parseInt(saved.last_reading),
        curr: parseInt(saved.current_units),
        unitsUsed: parseInt(saved.current_units) - parseInt(saved.last_reading),
        totalBill: parseInt(saved.total_bill),
        date: new Date(saved.createdAt || saved.timestamp || saved.date).toLocaleDateString()
      };

      setBillHistory([newBill, ...billHistory]);
      setCurrentReading('');
    } catch (err) {
      console.error('Error saving bill:', err);
      alert('Error saving bill');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Electricity Bill Calculator ⚡</h1>

      <form onSubmit={handleCalculate}>
        <input
          type="number"
          placeholder="Enter Current Reading"
          value={currentReading}
          onChange={(e) => setCurrentReading(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {billHistory.length > 0 && (
        <div className="result">
          <h3>Latest Bill</h3>
          <p>Previous Reading: {billHistory[0].prev}</p>
          <p>Current Reading: {billHistory[0].curr}</p>
          <p>Units Used: {billHistory[0].unitsUsed}</p>
          <p>Total Bill: ₹{billHistory[0].totalBill}</p>
          <p>Date: {billHistory[0].date}</p>
        </div>
      )}

      {billHistory.length > 0 && (
        <>
          <h2>Bill History</h2>
          <table>
            <thead>
              <tr>
               
                <th>Date</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Units Used</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billHistory.map((entry, index) => (
                <tr key={entry.id || index}>
                
                  <td>{entry.date}</td>
                  <td>{entry.prev}</td>
                  <td>{entry.curr}</td>
                  <td>{entry.unitsUsed}</td>
                  <td>{entry.totalBill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
