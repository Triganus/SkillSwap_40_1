import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>

      <nav style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Link to="/login">Login</Link>
        <Link to="/register/1">Register</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
    </div>
  );
}
