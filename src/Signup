// Signup.js
import React, { useState } from 'react';

export default function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    localStorage.setItem('user', JSON.stringify({ email, password }));
    alert('Signup successful!');
    onSignupSuccess();
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
