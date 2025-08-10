import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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

  const [params, setParams] = useSearchParams();
  const view = (params.get('view') || 'browse').toLowerCase(); // 'add' | 'browse'
  const isAdd = view === 'add';
  const isBrowse = view === 'browse';

  const paramsObj = { q, subject, from, to, minMins, sort, page, size };
  const { data, isFetching } = useListQuery(paramsObj);

  useEffect(() => {
    const stop = startRealtime(dispatch);
    return () => stop?.();
  }, [dispatch]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const setView = (v) => {
    const next = new URLSearchParams(params);
    next.set('view', v);
    setParams(next, { replace: true });
  };

  // keyboard arrows to switch tabs
  const addBtnRef = useRef(null);
  const browseBtnRef = useRef(null);
  const onTabsKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    if (isAdd) { setView('browse'); browseBtnRef.current?.focus(); }
    else { setView('add'); addBtnRef.current?.focus(); }
  };

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Study Logs</h1>
        <p className="subtitle">Log sessions, filter progress, and export insights.</p>
      </header>

      {/* View toggle */}
      <div className="viewbar">
        <div
          className="segmented"
          role="tablist"
          aria-label="Views"
          onKeyDown={onTabsKeyDown}
        >
          <button
            ref={addBtnRef}
            id="tab-add"
            className="segmented__btn"
            role="tab"
            aria-selected={isAdd}
            aria-controls="panel-add"
            onClick={() => setView('add')}
            type="button"
          >
            Add session
          </button>
          <button
            ref={browseBtnRef}
            id="tab-browse"
            className="segmented__btn"
            role="tab"
            aria-selected={isBrowse}
            aria-controls="panel-browse"
            onClick={() => setView('browse')}
            type="button"
          >
            Browse logs
          </button>
        </div>
      </div>

      {/* Panel: Add */}
      <section
        id="panel-add"
        role="tabpanel"
        aria-labelledby="tab-add"
        hidden={!isAdd}
        className="card"
      >
        <h2 className="sectionTitle">Log a Study Session</h2>
        <StudyLogForm
          onCreated={() => {
            // clear filters and jump to browse
            dispatch(setFilter({}));
            setView('browse');
          }}
        />
      </section>

      {/* Panel: Browse */}
      <section
        id="panel-browse"
        role="tabpanel"
        aria-labelledby="tab-browse"
        hidden={!isBrowse}
        className="card"
      >
        <StudyLogFilters itemsSample={items} />

        {isFetching && (
          <div role="status" aria-busy="true">
            <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
          </div>
        )}

        {!isFetching && items.length === 0 ? (
          <div className="empty">
            No entries match your filters. Try clearing filters or add a study session above.
          </div>
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
