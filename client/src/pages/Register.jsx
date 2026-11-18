import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    company: '',
    designation: '',
    batch: '',
    skills: '',
    linkedin: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', form);

      if (form.role === 'alumni') {
        setSuccess('Registered! Admin verify pannina aprom login panna mudiyum.');
      } else {
        setSuccess('Registered! Login page-ku poitu login pannunga.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot connect to server');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>

        <input name="department" placeholder="Department (e.g. IT)" value={form.department} onChange={handleChange} />

        {form.role === 'alumni' && (
          <>
            <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
            <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />
            <input name="batch" type="number" placeholder="Batch (e.g. 2022)" value={form.batch} onChange={handleChange} />
            <input name="skills" placeholder="Skills (React, Node, MySQL)" value={form.skills} onChange={handleChange} />
            <input name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} />
          </>
        )}

        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <p className="link-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}