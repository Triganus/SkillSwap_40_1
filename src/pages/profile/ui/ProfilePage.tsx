import { Link } from 'react-router-dom';
import { useAuthV2 } from '@app/Provider';

export default function ProfilePage() {
  const { user, logout } = useAuthV2();

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <>
          <p>{user.name}</p>
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
