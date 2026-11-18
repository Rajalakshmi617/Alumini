import { useParams, Link } from 'react-router-dom';

export default function Call() {
  const { room } = useParams();
  const url = `https://meet.jit.si/${room}`;

  return (
    <div className="page">
      <div className="call-bar">
        <Link to="/calls">← Back to Calls</Link>
        <a href={url} target="_blank" rel="noreferrer">
          Call load aagala na: Open in new tab
        </a>
      </div>

      <iframe
        src={url}
        allow="camera; microphone; fullscreen; display-capture"
        title="Video Call"
        className="call-frame"
      />
    </div>
  );
}