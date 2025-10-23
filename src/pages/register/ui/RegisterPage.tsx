import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

const TOTAL_STEPS = 3 as const;

export default function RegisterPage() {
  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();

  const current = Number(step ?? '1');

  if (!Number.isFinite(current) || current < 1 || current > TOTAL_STEPS) {
    return <Navigate to="/register/1" replace />;
  }

  const nextStep = current < TOTAL_STEPS ? current + 1 : undefined;
  const prevStep = current > 1 ? current - 1 : undefined;

  return (
    <div>
      <h1>Register</h1>
      <p>
        Шаг {current} из {TOTAL_STEPS}
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        {prevStep && <button onClick={() => navigate(`/register/${prevStep}`)}>Назад</button>}
        {nextStep ? (
          <button onClick={() => navigate(`/register/${nextStep}`)}>Дальше</button>
        ) : (
          <Link to="/login">Готово → Войти</Link>
        )}
      </div>
    </div>
  );
}
