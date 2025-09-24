import React from 'react';
import LoginPage from './LoginPage';

// This component simply renders the LoginPage but tells it to start in registration mode.
const RegisterPage = () => {
  return <LoginPage defaultToRegister={true} />;
};

export default RegisterPage;
