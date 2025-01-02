const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/traffic_violations', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Violation Model
const violationSchema = new mongoose.Schema({
  licensePlate: String,
  timestamp: { type: Date, default: Date.now },
  camera: String,
  violationImage: String,
  length: Number,
  width: Number
});

const Violation = mongoose.model('Violation', violationSchema);

// Routes
app.get('/api/violations', async (req, res) => {
  const violations = await Violation.find().sort({ timestamp: -1 });
  res.json(violations);
});

app.get('/api/violations/stats', async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.setDate(1));

  const dailyCount = await Violation.countDocuments({
    timestamp: { $gte: startOfDay }
  });
  const weeklyCount = await Violation.countDocuments({
    timestamp: { $gte: startOfWeek }
  });
  const monthlyCount = await Violation.countDocuments({
    timestamp: { $gte: startOfMonth }
  });

  res.json({ daily: dailyCount, weekly: weeklyCount, monthly: monthlyCount });
});

app.get('/api/violations/:id', async (req, res) => {
  const violation = await Violation.findById(req.params.id);
  res.json(violation);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});