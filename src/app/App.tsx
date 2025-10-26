// import { Link } from 'react-router-dom';
import './App.css';
// import { useAuth } from './Provider';
import AppRouter from '@app/router/AppRouter.tsx';

// function Header() {
//   const { auth, logout } = useAuth();
//   return (
//     <header style={{ display: 'flex', gap: 20 }}>
//       <Link to="/">Home</Link>
//       <Link to="/favorites">Favorites</Link>
//       <Link to="/profile">Profile</Link>
//       <div style={{ marginLeft: 'auto' }}>
//         {auth.isAuthenticated ? (
//           <>
//             <span style={{ marginRight: 8 }}>{auth.user?.name}</span>
//             <button onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <Link to="/login">Login</Link>
//         )}
//       </div>
//     </header>
//   );
// }

export default function App() {
  return <AppRouter />;
}
