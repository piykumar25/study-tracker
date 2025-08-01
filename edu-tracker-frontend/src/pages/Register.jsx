import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import './Form.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering:", form);
    // Call API here
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <h2>Register</h2>
      <Input label="Name" name="name" value={form.name} onChange={handleChange} />
      <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
      <Input label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
      <Button label="Register" />
    </form>
  );
}
