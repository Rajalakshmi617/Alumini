import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [company, setCompany] = useState("");
  const [skill, setSkill] = useState("");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [slotAlumni, setSlotAlumni] = useState(null);
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const loadAlumni = async () => {
    try {
      const { data } = await api.get("/alumni", { params: { company, skill } });
      setAlumni(data);
    } catch (err) {
      if (err.response?.status === 401) return logout(); // token expire aachu
      setError("Could not load alumni");
    }
  };

  useEffect(() => {
    loadAlumni();
  }, []);

  const sendRequest = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      await api.post("/referrals", {
        alumni_id: selected.id,
        message,
        resume_link: resumeLink,
      });
      setInfo(`Referral request sent to ${selected.name} ✅`);
      setSelected(null);
      setMessage("");
      setResumeLink("");
    } catch (err) {
      setError(err.response?.data?.error || "Request failed");
    }
  };

  const openSlots = async (a) => {
    setError("");
    setInfo("");
    try {
      const { data } = await api.get(`/slots/alumni/${a.id}`);
      setSlots(data);
      setSlotAlumni(a);
    } catch (err) {
      setError("Could not load slots");
    }
  };

  const bookSlot = async (slotId) => {
    try {
      await api.post(`/slots/${slotId}/book`);
      setInfo(`Call booked with ${slotAlumni.name} ✅ Calls page-la paarunga`);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    }
    setSlotAlumni(null);
  };

  return (
    <div className="page">
      <Navbar />
      <h2>Alumni Directory</h2>

      <div className="search-bar">
        <input
          placeholder="Company (e.g. Zoho)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Skill (e.g. React)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button onClick={loadAlumni}>Search</button>
      </div>

      {info && <p className="success">{info}</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {alumni.length === 0 && <p>No alumni found</p>}

        {alumni.map((a) => (
          <div key={a.id} className="card">
            <h3>{a.name}</h3>
            <p>
              <b>{a.designation}</b> @ {a.company}
            </p>
            <p>
              Batch: {a.batch} | {a.department}
            </p>
            <p>Skills: {a.skills}</p>
            {a.linkedin && (
              <a href={a.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}

            {user.role === "student" && (
              <>
                <button onClick={() => setSelected(a)}>Ask Referral</button>
                <button className="cancel" onClick={() => openSlots(a)}>
                  Book Call
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-bg">
          <form className="modal" onSubmit={sendRequest}>
            <h3>Referral request to {selected.name}</h3>
            <textarea
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <input
              placeholder="Resume link (Google Drive)"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />
            <button type="submit">Send</button>
            <button
              type="button"
              className="cancel"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {slotAlumni && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Free slots: {slotAlumni.name}</h3>
            {slots.length === 0 && <p>No free slots available.</p>}
            {slots.map((s) => (
              <button
                key={s.id}
                className="slot-btn"
                onClick={() => bookSlot(s.id)}
              >
                {new Date(s.start_time).toLocaleString()}
              </button>
            ))}
            <button className="cancel" onClick={() => setSlotAlumni(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
