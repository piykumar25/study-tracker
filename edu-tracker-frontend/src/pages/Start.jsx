import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './start.css';

export default function Start() {
  const [params] = useSearchParams();
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  useEffect(() => {
    // Set title & focus the preferred CTA
    document.title = 'Edu Tracker — Welcome';
    const prefer = (params.get('action') || '').toLowerCase();
    if (prefer === 'register' && registerRef.current) {
      registerRef.current.focus();
    } else if (loginRef.current) {
      loginRef.current.focus();
    }
  }, [params]);

  return (
    <main className="start-page" role="main">
      {/* Decorative background, clipped to viewport */}
      <div className="bg-spot bg-spot--tl" aria-hidden="true" />
      <div className="bg-spot bg-spot--br" aria-hidden="true" />

      <section className="hero" aria-labelledby="welcome-title">
        <header className="brand">
          {/* Replace with your SVG/logo if available */}
          <div aria-hidden="true" className="brand-mark">📘</div>
          <h1 id="welcome-title" className="title">Welcome to Edu Tracker</h1>
          <p className="subtitle">Focus. Log. Improve. Track study sessions with clarity.</p>
        </header>

        <nav className="actions" aria-label="Primary actions">
          <Link ref={loginRef} to="/login" className="btn btn--primary">
            Log in
          </Link>
          <Link ref={registerRef} to="/register" className="btn btn--ghost">
            Create account
          </Link>
        </nav>

        <ul className="value-points" aria-label="Key benefits">
          <li><span className="vp-ic" aria-hidden>📈</span>Progress dashboards & weekly insights</li>
          <li><span className="vp-ic" aria-hidden>🔒</span>Secure by default (JWT, HTTPS, role-based access)</li>
          <li><span className="vp-ic" aria-hidden>⚡</span>Fast logs, keyboard-first UX</li>
        </ul>
      </section>

      <footer className="start-footer" aria-label="Footer">
        <small>© {new Date().getFullYear()} Edu Tracker · v1.0</small>
      </footer>
    </main>
  );
}
