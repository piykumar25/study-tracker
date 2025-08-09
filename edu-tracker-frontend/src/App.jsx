import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import StudyLog from './features/studyLogs/pages/StudyLogPage';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // ensure this is imported once in your app

function isTokenValid(raw) {
  if (!raw) return false;
  try {
    // JWT format: header.payload.signature
    const [, payloadB64] = raw.split('.');
    if (!payloadB64) return true; // if not a JWT, allow (your backend may return opaque token)
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return true; // no exp claim, treat as valid
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp > nowSec;
  } catch {
    // if anything goes wrong decoding, don't block
    return true;
  }
}

// Route guard
function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('authToken');

  return token && isTokenValid(token) ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Study Log */}
        <Route
          path="/study/logs"
          element={
            <ProtectedRoute>
              <StudyLog />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: send unknown routes home (or to /login if you prefer) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
