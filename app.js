const express = require('express');
const axios = require('axios');

const app = express();
const windowSize = 10;
let numbers = [];

app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;
  const url = `https://test-server-api.com/${numberId}`; 

  try {
    const response = await axios.post(url);
    const newNumbers = response.data;

    
    newNumbers.forEach((num) => {
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    });

   
    if (numbers.length > windowSize) {
      numbers.shift();
    }

  
    const avg = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;

    
    res.json({
      windowPrevState: numbers.slice(0, -1),
      windowCurrState: numbers,
      numbers: newNumbers,
      avg: avg.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching numbers' });
  }
});

app.listen(9876, () => {
  console.log('Server listening on port 9876');
});