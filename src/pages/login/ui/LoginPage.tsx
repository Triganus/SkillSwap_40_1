import { type FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/Provider';
import type { DbUser } from '@entities/user/model/types/types.ts';

export default function LoginPage() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };
  const from = location.state?.from?.pathname ?? '/profile';

  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/db/users.json');

      if (!res.ok) throw new Error(`Failed to load users.json: ${res.status}`);

      const data: { users: DbUser[] } = await res.json();
      const list = data?.users ?? [];
      const normalized = name.trim();
      // Ищем по точному совпадению имени; если не найден, берём первого пользователя как дефолт
      const found = list.find((u) => u.name.toLowerCase() === normalized.toLowerCase()) ?? list[0];

      if (!found) {
        throw new Error('Список пользователей пуст');
      }

      login(found);
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
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="username"
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
