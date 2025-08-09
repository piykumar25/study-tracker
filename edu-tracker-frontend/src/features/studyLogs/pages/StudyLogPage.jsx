import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useListQuery } from '../../../services/studyLogsApi';
import { startRealtime } from '../../../services/realtime';
import { setFilter, setEditing } from '../studyLogsSlice';
import StudyLogForm from '../components/StudyLogForm';
import StudyLogFilters from '../components/StudyLogFilters';
import StudyLogTable from '../components/StudyLogTable';
import Pagination from '../components/Pagination';
import '../styles/studyLogs.css';

export default function StudyLogPage() {
  useEffect(() => { document.title = 'Study Tracker • Study Logs'; }, []);
  const dispatch = useDispatch();
  const { q, subject, from, to, minMins, sort, page, size } = useSelector(s => s.studyLogs);

  const params = { q, subject, from, to, minMins, sort, page, size };
  const { data, isFetching } = useListQuery(params);

  useEffect(() => {
    const stop = startRealtime(dispatch);
    return () => stop?.();
  }, [dispatch]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Study Logs</h1>
        <p className="subtitle">Log sessions, filter progress, and export insights.</p>
      </header>

      <section className="card">
        <h2 className="sectionTitle">Log a Study Session</h2>
        <StudyLogForm onCreated={() => dispatch(setFilter({}))} />
      </section>

      <section className="card">
        <StudyLogFilters itemsSample={items} />

        {isFetching && (
          <div role="status" aria-busy="true">
            <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
          </div>
        )}

        {!isFetching && items.length === 0 ? (
          <div className="empty">No entries match your filters. Try clearing filters or add a study session above.</div>
        ) : (
          <>
            <StudyLogTable rows={items} onEditRow={(id)=>dispatch(setEditing(id))} />
            <Pagination total={total} />
          </>
        )}
      </section>
    </div>
  );
}