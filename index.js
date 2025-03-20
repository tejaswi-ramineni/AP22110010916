require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
  }
  return true;
};

const getPrimeNumbers = (limit) => {
  const primes = [];
  for (let i = 2; i <= limit; i++) {
      if (isPrime(i)) primes.push(i);
  }
  return primes;
};

app.get('/test/primes', (req, res) => {
  const limit = 30; 
  const primeNumbers = getPrimeNumbers(limit);
  res.json({ numbers: primeNumbers });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
