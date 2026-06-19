import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// 1. POST API: Save student and apply placement logic criteria
router.post('/students', async (req, res) => {
  try {
    const { name, usn, codingScore, attendance, certifications } = req.body;

    // Easy Validation
    if (!name || !usn || codingScore === undefined || attendance === undefined) {
      return res.status(400).json({ message: 'All starred fields are required.' });
    }

    // Criteria: Ready ONLY if Coding Score >= 75 AND Attendance >= 85
    const computedStatus = (Number(codingScore) >= 75 && Number(attendance) >= 85) ? 'Ready' : 'Needs Training';

    const newStudent = new Student({
      name,
      usn,
      codingScore: Number(codingScore),
      attendance: Number(attendance),
      certifications: Number(certifications || 0),
      status: computedStatus
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This USN is already registered!' });
    }
    res.status(500).json({ message: error.message });
  }
});

// 2. GET API: Search, Filter, and calculate dashboard counters
router.get('/analytics', async (req, res) => {
  try {
    const { status, search } = req.query;
    let matchQuery = {};

    if (status) matchQuery.status = status;
    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { usn: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch lists and calculate metrics simultaneously
    const [allStudents, aggregateData] = await Promise.all([
      Student.find(matchQuery).sort({ createdAt: -1 }),
      Student.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            readyCount: { $sum: { $cond: [{ $eq: ["$status", "Ready"] }, 1, 0] } },
            avgCoding: { $avg: "$codingScore" },
            avgAttendance: { $avg: "$attendance" }
          }
        }
      ])
    ]);

    const summary = aggregateData[0] || { totalCount: 0, readyCount: 0, avgCoding: 0, avgAttendance: 0 };

    res.json({
      metrics: {
        total: summary.totalCount,
        ready: summary.readyCount,
        needsTraining: summary.totalCount - summary.readyCount,
        averageCodingScore: Math.round(summary.avgCoding || 0),
        averageAttendancePercentage: Math.round(summary.avgAttendance || 0)
      },
      students: allStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;