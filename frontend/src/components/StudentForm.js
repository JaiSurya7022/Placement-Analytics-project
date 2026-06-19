import React, { useState } from 'react';

export default function StudentForm({ onRecordAdded }) {
  const [form, setForm] = useState({ name: '', usn: '', codingScore: '', attendance: '', certifications: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.usn || form.codingScore === '' || form.attendance === '') {
      setError('Please fill in all standard required fields.');
      return;
    }

    const res = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Error occurred.');
    } else {
      setForm({ name: '', usn: '', codingScore: '', attendance: '', certifications: '' });
      onRecordAdded();
    }
  };

  return (
    <div className="form-card">
      <h3>📥 Register Student Profile</h3>
      {error && <div className="error-bar">{error}</div>}
      
      <form onSubmit={handleSubmit} className="input-grid">
        <div className="field"><label>Full Name *</label>
          <input type="text" placeholder="Rahul" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div className="field"><label>PES USN *</label>
          <input type="text" placeholder="PES1UG24MCA01" value={form.usn} onChange={e => setForm({...form, usn: e.target.value})} /></div>
        <div className="field"><label>Coding Score *</label>
          <input type="number" placeholder="0-100" value={form.codingScore} onChange={e => setForm({...form, codingScore: e.target.value})} /></div>
        <div className="field"><label>Attendance % *</label>
          <input type="number" placeholder="0-100" value={form.attendance} onChange={e => setForm({...form, attendance: e.target.value})} /></div>
        <div className="field"><label>Certifications</label>
          <input type="number" placeholder="0" value={form.certifications} onChange={e => setForm({...form, certifications: e.target.value})} /></div>
        <button type="submit" className="btn">🎯 Add Student</button>
      </form>
    </div>
  );
}