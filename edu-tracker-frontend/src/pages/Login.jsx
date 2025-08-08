import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button';
import './Form.css';
import { loginUser } from '../services/authService.js';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      const token = res?.data?.token;           // <-- matches AuthResponse { token }
      if (!token) {
        toast.error('No token returned from server.');
        return;
      }
      localStorage.setItem('authToken', token); // persist
      toast.success('Login successful!');
      navigate('/study/logs', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <Input label="Username" type="text" name="username" value={form.username} onChange={handleChange} />
      <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
      <Button label="Login" />
    </form>
  );
}
