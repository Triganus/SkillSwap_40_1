import { type FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/Provider';
import { login as authLogin } from '@api/auth';

export default function LoginPage() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };
  const from = location.state?.from?.pathname ?? '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      setError('Введите email и пароль');

      return;
    }

    setLoading(true);

    try {
      const result = await authLogin({ email: emailTrimmed, password: passwordTrimmed });

      login(result.user);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить вход');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20, maxWidth: 320 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {error && (
          <div role="alert" style={{ color: 'crimson' }}>
            {error}
          </div>
        )}
      </form>

      <p>
        <Link to="/register/1">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
