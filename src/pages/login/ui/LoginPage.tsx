import { type FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/Provider';

export default function LoginPage() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };
  const from = location.state?.from?.pathname ?? '/profile';

  const [name, setName] = useState('');

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ id: '1', name: name || 'User' });
    navigate(from, { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20, maxWidth: 320 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <button type="submit">Sign in</button>
      </form>

      <p>
        <Link to="/register/1">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
