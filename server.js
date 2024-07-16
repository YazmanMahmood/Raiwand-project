// server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, '')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bay1.html'));
});

app.get('/bay1', (req, res) => {
  res.sendFile(path.join(__dirname, 'bay1.html'));
});

app.get('/bays', (req, res) => {
  res.sendFile(path.join(__dirname, 'bays.html'));
});

app.get('/node1', (req, res) => {
  res.sendFile(path.join(__dirname, 'node1.html'));
});

app.get('/node2', (req, res) => {
  res.sendFile(path.join(__dirname, 'node2.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
