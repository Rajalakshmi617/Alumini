import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const load = async () => {
    try {
      const { data } = await api.get('/slots/mine');
      setCalls(data);
    } catch (err) {
      setError('Could not load calls');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createSlot = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      // "2026-12-20T18:00" -> "2026-12-20 18:00:00"
      await api.post('/slots', { start_time: startTime.replace('T', ' ') + ':00' });
      setInfo('Slot created ✅ Students ippo book panna mudiyum');
      setStartTime('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create slot');
    }
  };

  return (
    <div className="page">
      <Navbar />

      {user.role === 'alumni' && (
        <form className="card slot-form" onSubmit={createSlot}>
          <h3>Create a free slot</h3>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <button type="submit">Create Slot</button>
        </form>
      )}

      {info && <p className="success">{info}</p>}
      {error && <p className="error">{error}</p>}

      <h2>My Booked Calls</h2>
      {calls.length === 0 && <p>No booked calls yet.</p>}

      <div className="grid">
        {calls.map((c) => (
          <div key={c.id} className="card">
            <h3>{new Date(c.start_time).toLocaleString()}</h3>
            <p>Alumni: {c.alumni_name}</p>
            <p>Student: {c.student_name}</p>
            <Link to={`/call/${c.room_name}`}>
              <button>Join Call</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}