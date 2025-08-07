import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import './Form.css';

import { registerUser } from '../services/AuthService.js';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target; // 🔥 FIXED
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registering:", form);

    try {
      const response = await registerUser(form);
      console.log('Registration successful:', response.data);

      // ✅ Show user-friendly message (can be replaced with toast)
      toast.success('Registration successful! You can now log in.');

      // ✅ Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
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
