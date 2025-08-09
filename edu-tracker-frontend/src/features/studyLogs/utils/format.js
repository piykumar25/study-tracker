// Returns YYYY-MM-DD (default today)
export const toISO = (d = new Date()) =>
  new Date(d).toISOString().slice(0, 10);

// Formats minutes as "<n> mins"
export const fmtMins = (m) => `${m} mins`;
