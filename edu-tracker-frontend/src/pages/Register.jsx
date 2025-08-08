import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import './Form.css';
import { registerUser } from '../services/authService.js';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Trim only for username/email; keep password raw
    const v = name === 'password' ? value : value.trimStart();
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim() || form.username.trim().length < 3) {
      e.username = 'Username must be at least 3 characters';
    }
    if (!form.password || form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address';
    }
    if (!['USER', 'ADMIN'].includes(form.role)) {
      e.role = 'Role must be USER or ADMIN';
    }
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
      // API returns raw token string in response.data
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

      // Auto-login: persist token, then go to Study Logs
      localStorage.setItem('authToken', token);
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
    <form className="form" onSubmit={handleRegister} noValidate>
      <h2>Register</h2>

      <div style={{ marginBottom: 8 }}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <div className="field-error" role="alert">{errors.username}</div>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <div className="field-error" role="alert">{errors.password}</div>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <div className="field-error" role="alert">{errors.email}</div>
        )}
      </div>

      {/* If you prefer a dropdown instead of free-text for role, uncomment this block and remove the Input below.
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="role" style={{ display: 'block', fontWeight: 600 }}>Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange} className="input">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {errors.role && <div className="field-error" role="alert">{errors.role}</div>}
      </div>
      */}

      <div style={{ marginBottom: 8 }}>
        <Input
          label="Role"
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="USER or ADMIN"
          aria-invalid={!!errors.role}
        />
        {errors.role && (
          <div className="field-error" role="alert">{errors.role}</div>
        )}
      </div>

      <Button label={submitting ? 'Registering…' : 'Register'} disabled={submitting} />
    </form>
  );
}
