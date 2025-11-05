import type { IRequestOrchestrator } from '../types';
import { createAuthApiHandler } from './createAuthApiHandler';
import { createRegistrationCompleteHandler } from './createRegistrationCompleteHandler';

/**
 * Регистрация обработчиков запросов
 * Пример: orchestrator.registerHandler(createProductApiHandler(50));
 */
export function registerHandlers(orchestrator: IRequestOrchestrator): void {
  orchestrator.registerHandler(createAuthApiHandler(100));
  orchestrator.registerHandler(createRegistrationCompleteHandler(100));
}
