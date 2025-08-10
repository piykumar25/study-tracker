import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import './form.css';
import { registerUser } from '../services/authService.js';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const userRef = useRef(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Edu Tracker — Create account';
    userRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === 'password' ? value : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: v }));
    if (Object.keys(errors).length) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = 'Enter a valid email address';
    if (!['USER', 'ADMIN'].includes(form.role))
      e.role = 'Role must be USER or ADMIN';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      const token = res?.data; // plain string JWT from your controller
      if (!token || typeof token !== 'string') {
        toast.error('Registration succeeded but no token returned.');
        console.warn('Register response had no token:', res);
        setSubmitting(false);
        return;
      }

      localStorage.setItem('authToken', token); // auto-login
      toast.success('Registration successful!');
      navigate('/study/logs', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.';
      toast.error(msg);
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page" role="main">
      {/* optional background blobs to match Login; your form.css already clips overflow */}
      <div className="bg-spot bg-spot--tl" aria-hidden="true" />
      <div className="bg-spot bg-spot--br" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="register-title">
        <header className="auth-head">
          <div className="brand-mark" aria-hidden>📝</div>
          <h1 id="register-title" className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join Edu Tracker to log and track your progress.</p>
        </header>

        {/* screen-reader live region for field errors */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {Object.values(errors).filter(Boolean).join('. ')}
        </div>

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <Input
            ref={userRef}
            label="Username"
            type="text"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            aria-invalid={!!errors.username}
            required
          />
          {errors.username && <div className="field-error" role="alert">{errors.username}</div>}

          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            required
          />
          {errors.email && <div className="field-error" role="alert">{errors.email}</div>}

          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            required
          />
          {errors.password && <div className="field-error" role="alert">{errors.password}</div>}

          {/* Role as dropdown for safer input */}
          <div>
            <label htmlFor="role" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="select"
              aria-invalid={!!errors.role}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && <div className="field-error" role="alert">{errors.role}</div>}
          </div>

          {/* If you prefer the text input instead of select, use this and remove the block above:
          <Input
            label="Role"
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="USER or ADMIN"
            aria-invalid={!!errors.role}
          />
          {errors.role && <div className="field-error" role="alert">{errors.role}</div>}
          */}

          <Button
            label={submitting ? 'Creating account…' : 'Register'}
            disabled={submitting}
            className="btn-primary"
          />
        </form>

        <footer className="auth-foot">
          <span className="hint">Already have an account?</span>
          <Link to="/login" className="link link-cta">Log in</Link>
        </footer>
      </section>
    </main>
  );
}
