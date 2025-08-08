let studyLogsDB = [
  // We can start with an empty array or some pre-filled objects for demo
  // { id: '1691484800000', subject: 'Math', duration: 2, date: '2025-08-08', notes: 'Algebra practice' }
];


export async function fetchLogs() {
    await delay(500);

    return [...studyLogsDB];
}

export async function addLog(log) {
  await delay(300);
  studyLogsDB.push(log);
  return log;
}

export async function updateLog(id, updatedFields) {
  await delay(300);
  studyLogsDB = studyLogsDB.map(log => log.id === id ? { ...log, ...updatedFields } : log);
  return { id, ...updatedFields };
}

export async function deleteLog(id) {
  await delay(300);
  studyLogsDB = studyLogsDB.filter(log => log.id !== id);
  return id;
}

// Helper to simulate a delay
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}