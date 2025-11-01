/*
  Типы оркестратора MSW
  - IRequestHandler: контракт для всех обработчиков запросов
  - IRequestOrchestrator: контракт для оркестрации обработки запросов
*/

export interface IRequestHandler {
  /** Уникальный идентификатор для логирования/отладки */
  id: string;
  /** Обработчики с более высоким приоритетом выполняются первыми (по умолчанию: 0) */
  priority?: number;
  /** Возвращает true, если этот обработчик может обработать входящий запрос */
  canHandle(request: Request): boolean | Promise<boolean>;
  /** Обрабатывает запрос и возвращает замоканный Response */
  handle(request: Request): Promise<Response>;
}

export interface IRequestOrchestrator {
  /** Регистрирует обработчик. Обработчики хранятся в порядке приоритета (по убыванию) */
  registerHandler(handler: IRequestHandler): void;
  /** Очищает все зарегистрированные обработчики */
  reset(): void;
  /** Обрабатывает запрос, используя первый подходящий обработчик. Возвращает undefined, если совпадений нет */
  handleRequest(request: Request): Promise<Response | undefined>;
  /** Только для чтения список обработчиков (для диагностики/тестов) */
  getHandlers(): readonly IRequestHandler[];
}

export type Logger = Pick<Console, 'log' | 'warn' | 'error' | 'debug'>;
