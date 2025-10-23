import { Link } from 'react-router-dom';
import { useAuth } from '@app/Provider';

export default function ProfilePage() {
  const { auth, logout } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      {auth.user ? (
        <>
          <p>{auth.user.name}</p>
          <button onClick={logout}>Выйти</button>
        </>
      ) : (
        <p>
          Неизвестный пользователь. <Link to="/login">Войти</Link>
        </p>
      )}
    </div>
  );
}
