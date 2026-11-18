import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-links">
        <Link to="/">Directory</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/calls">Calls</Link>
      </div>
      <div>
        <span>{user.name} ({user.role})</span>
        <button className="small-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}