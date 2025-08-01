import { Link } from 'react-router-dom';
import './Start.css';

function Start() {
  return (
    <div className="start-page">
      <h1>Welcome to Edu Tracker</h1>
      <p>Choose your path:</p>
      <div className="nav-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </div>
  );
}

export default Start;
