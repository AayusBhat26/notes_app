import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { useState } from 'react';
import axiosInstance from '../../utils/axiosinstance';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setError('');

    try {
      const response = await axiosInstance.post('/login', {
        email: email.trim(),
        password: password.trim()
      });

      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Network error occurred');
      }
      console.error('Login error:', error);
    }
};

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='py-10 bg-white border rounded w-96 px-7'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>
              Login
            </h4>
            <input type='email' placeholder='Email' className='input-box'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />

            <PasswordInput
              password={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />

            {error && <p className='pb-1 text-xs text-red-500'>{error}</p>}

            <button type='submit' className='btn-primary'>Login</button>

            <p>
              Not Registered Yet? {" "} <Link to='/signup' className='font-medium underline text-primary'>Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}