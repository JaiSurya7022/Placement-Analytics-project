import React from 'react';

export default function AnalyticsDashboard({ data, statusFilter, setStatusFilter, searchVal, setSearchVal }) {
  const metrics = data.metrics || { total: 0, ready: 0, needsTraining: 0, averageCodingScore: 0, averageAttendancePercentage: 0 };
  const students = data.students || [];

  return (
    <div>
      {/* 4-Color Summary Row */}
      <div className="stats-row">
        <div className="stat-card"><div>Total Tracked</div><div className="stat-num">{metrics.total}</div></div>
        <div className="stat-card green"><div>Placement Ready</div><div className="stat-num">{metrics.ready}</div></div>
        <div className="stat-card orange"><div>Needs Training</div><div className="stat-num">{metrics.needsTraining}</div></div>
        <div className="stat-card cyan"><div>Avg Code Score</div><div className="stat-num">{metrics.averageCodingScore}%</div></div>
      </div>

      {/* Filter and Matrix Rows */}
      <div className="table-card">
        <div className="search-row">
          <input type="text" className="search-bar" placeholder="🔍 Search Name or USN..." value={searchVal} onChange={e => setSearchVal(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="dropdown">
            <option value="">All Conditions</option>
            <option value="Ready">Ready</option>
            <option value="Needs Training">Needs Training</option>
          </select>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>USN</th>
              <th>Name</th>
              <th>Coding Progress</th>
              <th>Attendance</th>
              <th>Certifications</th>
              <th>Readiness Result</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No parameters matched.</td></tr>
            ) : (
              students.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 'bold' }}>{s.usn}</td>
                  <td>{s.name}</td>
                  <td>
                    <span style={{ marginRight: '8px', fontWeight: 'bold' }}>{s.codingScore}</span>
                    <div className="meter-bg">
                      <div className={`meter-fill ${s.codingScore >= 75 ? 'pass' : ''}`} style={{ width: `${s.codingScore}%` }} />
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold', color: s.attendance >= 85 ? '#10b981' : '#ef4444' }}>{s.attendance}%</td>
                  <td>{s.certifications}</td>
                  <td>
                    <span className={`badge-pill ${s.status === 'Ready' ? 'ready' : 'train'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}