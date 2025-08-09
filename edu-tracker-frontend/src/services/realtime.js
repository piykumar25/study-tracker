import { studyLogsApi } from './studyLogsApi';

export function startRealtime(dispatch, { type = 'sse', url } = {}) {
  const base = (import.meta.env?.VITE_API_BASE_URL) || '/api';
  const streamUrl = url || `${base.replace(/\/$/, '')}/study-logs/stream`;
  const invalidate = () =>
    dispatch(studyLogsApi.util.invalidateTags([{ type: 'StudyLogs', id: 'LIST' }]));

  if (type === 'sse') {
    const es = new EventSource(streamUrl);
    es.addEventListener('created', invalidate);
    es.addEventListener('updated', invalidate);
    es.addEventListener('deleted', invalidate);
    es.onerror = () => {};
    return () => es.close();
  }

  const ws = new WebSocket(streamUrl.replace(/^http/, 'ws'));
  ws.onmessage = invalidate;
  ws.onerror = () => {};
  return () => ws.close();
}
