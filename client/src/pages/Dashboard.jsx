import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const load = async () => {
    try {
      const { data } = await api.get('/referrals/mine');
      setRequests(data);
    } catch (err) {
      setError('Could not load requests');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/referrals/${id}`, { status });
      load(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="page">
      <Navbar />
      <h2>{user.role === 'student' ? 'My Referral Requests' : 'Requests Received'}</h2>

      {error && <p className="error">{error}</p>}
      {requests.length === 0 && <p>No requests yet.</p>}

      <div className="grid">
        {requests.map((r) => (
          <div key={r.id} className="card">
            <span className={`badge ${r.status}`}>{r.status}</span>

            {user.role === 'student' ? (
              <h3>To: {r.alumni_name}</h3>
            ) : (
              <h3>From: {r.student_name}</h3>
            )}

            <p>{r.message}</p>

            {r.resume_link && (
              <a href={r.resume_link} target="_blank" rel="noreferrer">View Resume</a>
            )}

            <p className="date">{new Date(r.created_at).toLocaleDateString()}</p>

            {user.role === 'alumni' && r.status !== 'referred' && r.status !== 'rejected' && (
              <div className="actions">
                {r.status === 'requested' && (
                  <button onClick={() => updateStatus(r.id, 'accepted')}>Accept</button>
                )}
                {r.status === 'accepted' && (
                  <button onClick={() => updateStatus(r.id, 'referred')}>Mark Referred</button>
                )}
                <button className="cancel" onClick={() => updateStatus(r.id, 'rejected')}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}