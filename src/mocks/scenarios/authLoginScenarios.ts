/**
 * Сценарии ответа для логина в MSW.
 * Централизует ветвления по заголовку x-msw-scenario и тестовым email/password.
 */

export const SCENARIO_HEADER = 'x-msw-scenario' as const;

export type ErrorScenario = '500' | '404' | '401';

/**
 * Возвращает Response для ошибки сценария или null, если сценарий не сработал (успех).
 *
 * Правила:
 * - 500: заголовок '500' или email === server.error@te.st
 * - 404: заголовок '404' или email === nouser@te.st
 * - 401: заголовок '401' или password ∈ {'wrong','badpass'}
 */
export function getAuthLoginScenarioResponse(
  email: string,
  password: string,
  scenario?: ErrorScenario | null
): Response | null {
  const s = scenario?.toLowerCase();
  const em = email.toLowerCase();

  if (s === '500' || em === 'server.error@te.st') {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }

  if (s === '404' || em === 'nouser@te.st') {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  if (s === '401' || password === 'wrong' || password === 'badpass') {
    return Response.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  return null;
}
