import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../studyLogsSlice';
import '../../studyLogs/styles/studyLogs.css';
import { useEffect, useMemo, useState } from 'react';

export default function StudyLogFilters({ itemsSample = [] }) {
  const dispatch = useDispatch();
  const { q, subject, from, to, minMins } = useSelector(s => s.studyLogs);

  // Build subject list from current page sample; ideally backend returns a distinct list
  const subjects = useMemo(() => Array.from(new Set(itemsSample.map(i => i.subject))).sort(), [itemsSample]);

  // Debounce search
  const [localQ, setLocalQ] = useState(q);
  useEffect(() => setLocalQ(q), [q]);
  useEffect(() => {
    const t = setTimeout(() => dispatch(setFilter({ q: localQ })), 300);
    return () => clearTimeout(t);
  }, [localQ, dispatch]);

  return (
    <div className="filters">
      <input className="input" placeholder="Search subject/notes…" value={localQ} onChange={e=>setLocalQ(e.target.value)} aria-label="Search" />
      <select className="select" value={subject} onChange={e=>dispatch(setFilter({ subject: e.target.value }))} aria-label="Filter by subject">
        <option value="">All subjects</option>
        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input className="input" type="date" value={from} onChange={e=>dispatch(setFilter({ from: e.target.value }))} aria-label="From date" />
      <input className="input" type="date" value={to} onChange={e=>dispatch(setFilter({ to: e.target.value }))} aria-label="To date" />
      <input className="input" type="number" min="0" step="5" value={minMins} onChange={e=>dispatch(setFilter({ minMins: e.target.value }))} aria-label="Min minutes" placeholder="Min mins" />
    </div>
  );
}