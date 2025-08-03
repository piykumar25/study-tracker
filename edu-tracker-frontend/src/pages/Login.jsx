import { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button';
import './Form.css';
import { loginUser } from '../services/AuthService.js';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
  setForm({ ...form, [e.name]: e.value });
};

  const handleLogin = (e) => {
    e.preventDefault(); 

    loginUser(form)
      .then((response) => {
        alert('Login successful:', response.data);
      })
      .catch((error) => {
        alert('Login failed:', error);
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