import { setupWorker } from 'msw/browser';
import { http, passthrough, HttpResponse } from 'msw';
import { createRequestOrchestrator } from './orchestrator/createRequestOrchestrator';
import { registerHandlers } from './handlers';

const logger = console;
const orchestrator = createRequestOrchestrator(logger);
registerHandlers(orchestrator);

const delegate = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const startedAt = performance.now();

  logger.log?.(`[MSW] ⇢ ${request.method} ${url.pathname}${url.search}`);

  try {
    const res = await orchestrator.handleRequest(request);
    const dur = (performance.now() - startedAt).toFixed(1);

    if (res) {
      logger.log?.(
        `[MSW] ⇠ mocked ${request.method} ${url.pathname} • ${dur}ms • status ${res.status}`
      );
      const body = await res.text();

      return new HttpResponse(body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    }

    logger.log?.(`[MSW] ⇠ bypass ${request.method} ${url.pathname} • ${dur}ms`);
    return passthrough();
  } catch (error) {
    logger.error?.('[MSW] delegate error', error);
    return passthrough();
  }
};

export const worker = setupWorker(
  http.all('*/api/*', delegate),
);

worker.events.on('request:start', ({ request }) => {
  const { method, url } = request;
  const { pathname } = new URL(url);

  logger.debug?.('[MSW][event] request:start', method, pathname);
});

worker.events.on('request:unhandled', ({ request }) => {
  const { method, url } = request;
  const { pathname } = new URL(url);

  logger.warn?.('[MSW][event] request:unhandled', method, pathname);
});

worker.events.on('response:mocked', ({ request, response }) => {
  const { method, url } = request;
  const { pathname } = new URL(url);

  logger.debug?.('[MSW][event] response:mocked', method, pathname, 'status=', response.status);
});

worker.events.on('response:bypass', ({ request, response }) => {
  const { method, url } = request;
  const { pathname } = new URL(url);

  logger.debug?.('[MSW][event] response:bypass', method, pathname, 'status=', response?.status);
});
