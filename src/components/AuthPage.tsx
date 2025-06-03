
import React, { useState } from 'react';
import AuthContainer from './auth/AuthContainer';
import AuthForm from './auth/AuthForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import { useAuthHandlers } from '@/hooks/useAuthHandlers';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'client' | 'barber'>('client');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    loading,
    handleAuth,
    handleForgotPassword,
    handleGoogleAuth,
    handleAppleAuth,
    handleGuestLogin
  } = useAuthHandlers();

  const onSubmit = (e: React.FormEvent) => {
    return handleAuth(e, isLogin, email, password, fullName, userType);
  };

  const onForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleForgotPassword(email);
    setShowForgotPassword(false);
  };

  const getTitle = () => {
    if (showForgotPassword) return 'Reset Password';
    return isLogin ? 'Sign In to Book' : 'Get Started - It\'s Free!';
  };

  return (
    <AuthContainer title={getTitle()}>
      {showForgotPassword ? (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          onSubmit={onForgotPassword}
          onBack={() => setShowForgotPassword(false)}
        />
      ) : (
        <AuthForm
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          userType={userType}
          setUserType={setUserType}
          loading={loading}
          onSubmit={onSubmit}
          onGoogleAuth={handleGoogleAuth}
          onAppleAuth={handleAppleAuth}
          onForgotPassword={() => setShowForgotPassword(true)}
          onGuestLogin={handleGuestLogin}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      )}
    </AuthContainer>
  );
};

export default AuthPage;
