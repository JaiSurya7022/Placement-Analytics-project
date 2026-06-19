import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Keeping unique: true here automatically builds the necessary index cleanly
  usn: { type: String, required: true, unique: true, uppercase: true },
  codingScore: { type: Number, required: true, min: 0, max: 100 },
  attendance: { type: Number, required: true, min: 0, max: 100 },
  certifications: { type: Number, default: 0 },
  status: { type: String, enum: ['Ready', 'Needs Training'], default: 'Needs Training' }
}, { timestamps: true });

// Index only status for rapid query filtering
studentSchema.index({ status: 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;