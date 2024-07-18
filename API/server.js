const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const FormResponseSchema = new mongoose.Schema({
  tutorEmail: String,
  students: [{
    name: String,
    subjects: [String],
    lastMeeting: Date,
    bookingFrequency: String,
    diagnosticExam: {
      assigned: Boolean,
      score: String,
      lastAssigned: Date,
      nextAssigned: Date
    }
  }],
  problems: [{
    studentName: String,
    details: String
  }],
  submittedAt: { type: Date, default: Date.now }
});

const FormResponse = mongoose.model('FormResponse', FormResponseSchema);

app.post('/api/submit-form', async (req, res) => {
  try {
    const formResponse = new FormResponse(req.body);
    await formResponse.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await FormResponse.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));