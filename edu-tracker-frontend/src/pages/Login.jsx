import { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button';
import './Form.css';
import { loginUser } from '../services/AuthService.js';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target; // 🔥 FIXED
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault(); 

    loginUser(form)
      .then((response) => {
        toast.success('Login successful!');
        console.log('Login successful:', response.data);
      })
      .catch((error) => {
        toast.error('Login failed. Please check your credentials and try again.');
        console.error('Login failed:', error);
      });
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