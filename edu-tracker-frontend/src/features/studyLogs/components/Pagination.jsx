import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../studyLogsSlice';
import '../../studyLogs/styles/studyLogs.css';

export default function Pagination({ total }) {
  const dispatch = useDispatch();
  const { page, size } = useSelector(s => s.studyLogs);
  const pageCount = Math.max(1, Math.ceil((total || 0) / size));
  if (pageCount <= 1) return null;
  const go = (p) => dispatch(setPage(p));
  return (
    <div className="pagination">
      <button className="btn btnSmall" onClick={()=>go(1)} disabled={page===1}>« First</button>
      <button className="btn btnSmall" onClick={()=>go(page-1)} disabled={page===1}>‹ Prev</button>
      <span>Page {page} of {pageCount}</span>
      <button className="btn btnSmall" onClick={()=>go(page+1)} disabled={page===pageCount}>Next ›</button>
      <button className="btn btnSmall" onClick={()=>go(pageCount)} disabled={page===pageCount}>Last »</button>
    </div>
  );
}