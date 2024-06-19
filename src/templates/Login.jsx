// eslint-disable-next-line @next/next/no-html-link-for-pages

import React, { useRef } from 'react';
import '@styles/Login.scss';
import logo from '@logos/logo_yard_sale.svg';
import Link from 'next/link';

const Login = () => {
  const form = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(form.current);
    const data = {
      usename: formData.get('email'),
      password: formData.get('password'),
    };
  };

  return (
    <div className="Login">
      <div className="Login-container">
        <img src={logo} alt="logo" className="logo" />
        <form action="/" className="form" ref={form}>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input type="text" name="email" placeholder="platzi@example.cm" className="input input-email" />
          <label htmlFor="password" className="label">
            Password
          </label>
          <input type="password" name="password" placeholder="*********" className="input input-password" />
          <button onClick={handleSubmit} className="primary-button login-button">
            Log in
          </button>
          <Link href="/">Forgot my password</Link>
        </form>
        <button className="secondary-button signup-button">Sign up</button>
      </div>
    </div>
  );
};

export default Login;
