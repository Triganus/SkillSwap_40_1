import type { IRequestOrchestrator } from '../types';
import { createAuthApiHandler } from './createAuthApiHandler';

/**
 * Регистрация обработчиков запросов
 * Пример: orchestrator.registerHandler(createProductApiHandler(50));
 */
export function registerHandlers(orchestrator: IRequestOrchestrator): void {
  orchestrator.registerHandler(createAuthApiHandler(100));
}
