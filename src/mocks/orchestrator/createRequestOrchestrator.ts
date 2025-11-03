import type { IRequestHandler, IRequestOrchestrator, Logger } from '../types';

/**
 * Функциональный оркестратор запросов (Цепочка обязанностей)
 * - Хранит обработчики в порядке приоритета (по убыванию)
 * - Делегирует запрос первому подходящему обработчику
 * - Возвращает undefined для указания на обход к реальному API
 */
export function createRequestOrchestrator(logger: Logger = console): IRequestOrchestrator {
  const handlers: IRequestHandler[] = [];

  return {
    registerHandler(handler: IRequestHandler): void {
      handlers.push(handler);
      handlers.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      logger.debug?.('[MSW] Registered handler', handler.id, 'priority=', handler.priority ?? 0);
    },

    getHandlers(): readonly IRequestHandler[] {
      return handlers;
    },

    reset(): void {
      handlers.length = 0;
      logger.debug?.('[MSW] Orchestrator reset handlers');
    },

    async handleRequest(request: Request): Promise<Response | undefined> {
      const url = new URL(request.url);
      logger.debug?.(`[MSW] Orchestrator received: ${request.method} ${url.pathname}`);

      for (const h of handlers) {
        try {
          const match = await h.canHandle(request);
          if (!match) continue;
          logger.debug?.('[MSW] Matched handler:', h.id);
          return await h.handle(request);
        } catch (err) {
          logger.error?.(`[MSW] Handler ${h.id} error:`, err);
          // continue to next handler
        }
      }

      logger.debug?.('[MSW] No handler matched. Bypassing to real API.');
      return undefined;
    },
  };
}
