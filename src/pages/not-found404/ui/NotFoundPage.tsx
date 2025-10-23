import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 — Страница не найдена</h1>
      <p>
        Такой страницы нет. Вернуться на <Link to="/">главную</Link>.
      </p>
    </div>
  );
}
