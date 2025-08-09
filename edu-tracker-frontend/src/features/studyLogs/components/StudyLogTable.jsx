import { useDispatch, useSelector } from 'react-redux';
import { useUpdateMutation, useRemoveMutation } from '../../../services/studyLogsApi';
import { setFilter, setEditing } from '../studyLogsSlice';
import { fmtMins } from '../utils/format';
import '../../studyLogs/styles/studyLogs.css';
import { useEffect, useState } from 'react';

function RowView({ row, onEdit, onDelete }) {
  return (
    <tr>
      <td className="td">{row.date}</td>
      <td className="td">{row.subject}</td>
      <td className="td">{fmtMins(row.durationMins)}</td>
      <td className="td">{row.notes || '—'}</td>
      <td className="td actions">
        <button onClick={onEdit} className="btn btnSmall">Edit</button>{' '}
        <button onClick={onDelete} className="btn btnSmall btnDanger">Delete</button>
      </td>
    </tr>
  );
}
function RowEdit({ row, onCancel }) {
  const [update, { isLoading }] = useUpdateMutation();
  const [draft, setDraft] = useState({ subject: row.subject, durationMins: row.durationMins, date: row.date, notes: row.notes || '' });
  return (
    <tr>
      <td className="td"><input type="date" className="input" value={draft.date} onChange={e=>setDraft(s=>({ ...s, date: e.target.value }))} /></td>
      <td className="td"><input className="input" value={draft.subject} onChange={e=>setDraft(s=>({ ...s, subject: e.target.value }))} /></td>
      <td className="td"><input type="number" min="1" step="1" className="input" value={draft.durationMins} onChange={e=>setDraft(s=>({ ...s, durationMins: Number(e.target.value) }))} /></td>
      <td className="td"><input className="input" value={draft.notes} onChange={e=>setDraft(s=>({ ...s, notes: e.target.value }))} /></td>
      <td className="td actions">
        <button className="btn btnSmall btnPrimary" disabled={isLoading} onClick={async ()=>{ await update({ id: row.id, patch: draft }); onCancel(); }}>Save</button>{' '}
        <button className="btn btnSmall" onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
}

export default function StudyLogTable({ rows }) {
  const dispatch = useDispatch();
  const { sort, editingId } = useSelector(s => s.studyLogs);
  const [remove] = useRemoveMutation();

  // client-side sort (server should also support)
  const sorted = [...rows].sort((a,b) => {
    switch (sort) {
      case 'dateAsc': return a.date.localeCompare(b.date);
      case 'durationDesc': return (b.durationMins||0) - (a.durationMins||0);
      case 'durationAsc': return (a.durationMins||0) - (b.durationMins||0);
      default: return b.date.localeCompare(a.date); // dateDesc
    }
  });

  return (
    <>
      <div className="toolbar">
        <h2 className="sectionTitle">Your Entries</h2>
        <select className="select" aria-label="Sort by" value={sort} onChange={e=>dispatch(setFilter({ sort: e.target.value }))}>
          <option value="dateDesc">Newest first</option>
          <option value="dateAsc">Oldest first</option>
          <option value="durationDesc">Longest duration</option>
          <option value="durationAsc">Shortest duration</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="th">Date</th>
            <th className="th">Subject</th>
            <th className="th">Duration</th>
            <th className="th">Notes</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            editingId === row.id ? (
              <RowEdit key={row.id} row={row} onCancel={() => dispatch(setEditing(null))} />
            ) : (
              <RowView key={row.id} row={row} onEdit={() => dispatch(setEditing(row.id))} onDelete={async ()=>{ if (confirm('Delete this entry?')) await remove(row.id); }} />
            )
          ))}
        </tbody>
      </table>
    </>
  );
}