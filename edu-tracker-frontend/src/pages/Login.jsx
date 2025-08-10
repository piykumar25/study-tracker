import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button';
import './form.css';
import { loginUser } from '../services/authService.js';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    username: params.get('username') || '',
    password: '',
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const userRef = useRef(null);

  useEffect(() => {
    document.title = 'Edu Tracker — Log in';
    userRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (fieldError) setFieldError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setFieldError('Username and password are required.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await loginUser({ username: form.username.trim(), password: form.password });
      const token = res?.data?.token;
      if (!token) { toast.error('No token returned from server.'); return; }
      (form.remember ? localStorage : sessionStorage).setItem('authToken', token);
      toast.success('Welcome back!');
      navigate('/study/logs', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setFieldError('Invalid username or password.');
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page" role="main">
      {/* optional matching background blobs to Start page (clip overflow by CSS) */}
      <div className="bg-spot bg-spot--tl" aria-hidden="true" />
      <div className="bg-spot bg-spot--br" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="login-title">
        <header className="auth-head">
          <div className="brand-mark" aria-hidden>🔐</div>
          <h1 id="login-title" className="auth-title">Log in</h1>
          <p className="auth-subtitle">Access your study logs and insights.</p>
        </header>

        {/* SR area for live errors */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">{fieldError}</div>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <Input
            ref={userRef}
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            required
            aria-invalid={fieldError ? 'true' : 'false'}
          />

          <div className="password-row">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {fieldError && <p className="field-error">{fieldError}</p>}

          <div className="auth-actions">
            <label className="remember">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="link-muted">Forgot password?</Link>
          </div>

          <Button
            label={submitting ? 'Signing in…' : 'Login'}
            disabled={submitting}
            className="btn-primary"
          />
        </form>

        <footer className="auth-foot">
          <span className="hint">New here?</span>
          <Link to="/register" className="link link-cta">Create an account</Link>
        </footer>
      </section>
    </main>
  );
}
