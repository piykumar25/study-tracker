import { useState } from 'react';
import { useCreateMutation } from '../../../services/studyLogsApi';
import { toISO } from '../utils/format';
import '../../studyLogs/styles/studyLogs.css';

export default function StudyLogForm({ onCreated }) {
  const [create, { isLoading }] = useCreateMutation();
  const [form, setForm] = useState({ subject: '', durationMins: '', date: toISO(), notes: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = 'Subject is required';
    const mins = Number(form.durationMins);
    if (!form.durationMins || Number.isNaN(mins) || mins <= 0) e.durationMins = 'Enter minutes > 0';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) e.date = 'Pick a valid date';
    if ((form.notes || '').length > 500) e.notes = 'Max 500 characters';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    const payload = { subject: form.subject.trim(), durationMins: Number(form.durationMins), date: form.date, notes: form.notes.trim() };
    const res = await create(payload).unwrap();
    onCreated?.(res);
    setForm({ subject: '', durationMins: '', date: toISO(), notes: '' });
  };

  return (
    <form noValidate onSubmit={submit} className="form" style={{ display:'grid', gap:12 }}>
      <div>
        <label htmlFor="subject">Subject *</label>
        <input id="subject" name="subject" className="input" value={form.subject} onChange={e=>setForm(s=>({ ...s, subject:e.target.value }))} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'err-subject' : undefined} />
        {errors.subject && <div id="err-subject" className="error" role="alert">{errors.subject}</div>}
      </div>
      <div>
        <label htmlFor="durationMins">Duration (mins) *</label>
        <input id="durationMins" name="durationMins" type="number" min="1" step="1" className="input" value={form.durationMins} onChange={e=>setForm(s=>({ ...s, durationMins:e.target.value }))} aria-invalid={!!errors.durationMins} aria-describedby={errors.durationMins ? 'err-mins' : undefined} />
        {errors.durationMins && <div id="err-mins" className="error" role="alert">{errors.durationMins}</div>}
      </div>
      <div>
        <label htmlFor="date">Date *</label>
        <input id="date" name="date" type="date" className="input" value={form.date} onChange={e=>setForm(s=>({ ...s, date:e.target.value }))} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'err-date' : undefined} />
        {errors.date && <div id="err-date" className="error" role="alert">{errors.date}</div>}
      </div>
      <div>
        <label htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" rows={3} className="textarea" value={form.notes} onChange={e=>setForm(s=>({ ...s, notes:e.target.value }))} aria-invalid={!!errors.notes} aria-describedby={errors.notes ? 'err-notes' : undefined} />
        {errors.notes && <div id="err-notes" className="error" role="alert">{errors.notes}</div>}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" className="btn btnPrimary" disabled={isLoading}>{isLoading ? 'Saving…' : 'Save Session'}</button>
        <button type="button" className="btn" onClick={() => setForm({ subject:'', durationMins:'', date: toISO(), notes:'' })}>Reset</button>
      </div>
    </form>
  );
}