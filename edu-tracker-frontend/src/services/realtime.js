import { studyLogsApi } from './studyLogsApi';

function getToken() {
  return localStorage.getItem('authToken')
    || localStorage.getItem('token')
    || sessionStorage.getItem('authToken');
}

export function startRealtime(dispatch, { type = 'fetch', url } = {}) {
  const base = (import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8083/api/v1';
  const streamUrl = url || `${base.replace(/\/$/, '')}/study-logs/stream`;
  const invalidate = () =>
    dispatch(studyLogsApi.util.invalidateTags([{ type: 'StudyLogs', id: 'LIST' }]));

  if (type !== 'fetch') {
    // fall back to SSE query-token (Option A)
    return startRealtime(dispatch, { type: 'sse', url: streamUrl });
  }

  const controller = new AbortController();
  (async () => {
    const resp = await fetch(streamUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${getToken()}`,
      },
      signal: controller.signal,
    });
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // Simple SSE frame parsing
      let idx;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);

        // Extract "event:" if present
        const ev = frame.split('\n').find(l => l.startsWith('event:'))?.slice(6).trim();
        // const data = frame.split('\n').find(l => l.startsWith('data:'))?.slice(5).trim();

        if (ev === 'created' || ev === 'updated' || ev === 'deleted') {
          invalidate();
        }
      }
    }
  })().catch(() => {});

  return () => controller.abort();
}
