import React, { useState, useEffect, useCallback } from 'react';
import StudentForm from './components/StudentForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [data, setData] = useState({ metrics: null, students: [] });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchVal, setSearchVal] = useState('');

  const loadData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/analytics?status=${statusFilter}&search=${searchVal}`);
      const resData = await response.json();
      setData(resData);
    } catch (err) {
      console.error("Connection down to server:", err);
    }
  }, [statusFilter, searchVal]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <span className="badge">PES UNIVERSITY</span>
        <h2>Placement Readiness Board</h2>
      </header>

      <StudentForm onRecordAdded={loadData} />
      <AnalyticsDashboard data={data} statusFilter={statusFilter} setStatusFilter={setStatusFilter} searchVal={searchVal} setSearchVal={setSearchVal} />
    </div>
  );
}