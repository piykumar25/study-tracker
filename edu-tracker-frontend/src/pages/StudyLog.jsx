// src/pages/StudyLog.jsx
import { useEffect } from 'react';

// NOTE: We’ll introduce Redux + real components next.
// For now, keep this page minimal so your app still compiles.

export default function StudyLog() {
  useEffect(() => {
    document.title = 'Study Tracker • Study Logs';
  }, []);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Study Logs</h1>
        <p style={subtitleStyle}>
          Log your study sessions and track progress over time.
        </p>
      </header>

      {/* ==== Form Mount Point (will be replaced with <StudyLogForm />) ==== */}
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Log a Study Session</h2>
        <p style={placeholderStyle}>
          Form coming next (subject, duration, date, notes) — we’ll add validation and Redux wiring.
        </p>
      </section>

      {/* ==== List Mount Point (will be replaced with <StudyLogList />) ==== */}
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Your Entries</h2>
        <p style={placeholderStyle}>
          List coming next — edit/delete + empty state + loading states via Redux.
        </p>
      </section>
    </div>
  );
}

/* --------- Temporary inline styles (we’ll move to CSS soon) --------- */
const containerStyle = {
  maxWidth: 900,
  margin: '24px auto',
  padding: '0 16px',
};

const headerStyle = {
  marginBottom: 16,
};

const titleStyle = {
  margin: 0,
  fontSize: '28px',
  lineHeight: 1.2,
};

const subtitleStyle = {
  margin: '6px 0 0',
  color: '#555',
};

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

const sectionTitleStyle = {
  margin: '0 0 12px',
  fontSize: '18px',
};

const placeholderStyle = {
  margin: 0,
  color: '#6b7280',
  fontStyle: 'italic',
};
