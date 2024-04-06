import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/authenticate';

export default function Register() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [alert, setAlert] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match');
      return;
    }

    try {
      const success = await registerUser(user, password, password2);
      if (success) {
        router.push('/login');
      } else {
        setAlert('Username already taken or unable to register. Please try again with a different username.');
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      setAlert('An error occurred during registration. Please try again later.');
    }
  }

  const togglePasswordVisibility = (inputId) => {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h1 className="mb-4">Register</h1>
          {alert && <div className="alert alert-danger" role="alert">{alert}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)} required />
            </div>
            <div className="mb-3 position-relative">
              <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" onClick={() => togglePasswordVisibility('password')}>
                Show
              </button>
            </div>
            <div className="mb-3 position-relative">
              <input type="password" className="form-control" id="password2" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
              <button type="button" className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" onClick={() => togglePasswordVisibility('password2')}>
                Show
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
