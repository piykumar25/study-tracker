import { use, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import './Form.css';

import { registerUser } from '../services/AuthService.js';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'USER'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.name]: e.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering:", form);
    // Call API here
    registerUser(form)
      .then((response) => {
        console.log('Registration successful:', response.data);
      })
      .catch((error) => {
        console.error('Registration failed:', error);
      });
  };


  return (
    <form className="form" onSubmit={handleRegister}>
      <h2>Register</h2>
      <Input label="Username" type="text" name="username" value={form.username} onChange={handleChange} />
      <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
      <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
      <Input label="Role" type="text" name="role" value={form.role} onChange={handleChange} placeholder="USER or ADMIN" />
      <Button label="Register" />
    </form>
  );
}
