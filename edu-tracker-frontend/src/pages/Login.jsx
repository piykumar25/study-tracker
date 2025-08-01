import { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button';
import './Form.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '', password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", form);
    // Call API here
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
      <Input label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
      <Button label="Login" />
    </form>
  );
}
