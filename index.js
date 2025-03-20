import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const dataWindow = [];

const API_URLS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand"
};

const fetchNumbers = async (type) => {
  if (!API_URLS[type]) {
    throw new Error("Invalid number type");
  }
  
  try {
    const response = await fetch(API_URLS[type]);
    const json = await response.json();
    return json.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
};

app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;
  
  if (!API_URLS[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const prevState = [...dataWindow];
  const newNumbers = await fetchNumbers(type);
  newNumbers.forEach(num => {
    if (!dataWindow.includes(num)) {
      dataWindow.push(num);
    }
  });
  while (dataWindow.length > WINDOW_SIZE) {
    dataWindow.shift();
  }
  const avg = dataWindow.length > 0 
    ? (dataWindow.reduce((a, b) => a + b, 0) / dataWindow.length).toFixed(2) 
    : 0;

  res.json({
    windowPrevState: prevState,
    windowCurrState: dataWindow,
    numbers: newNumbers,
    avg: parseFloat(avg)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
