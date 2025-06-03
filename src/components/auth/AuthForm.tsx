
import React from 'react';
import SocialAuthButtons from './SocialAuthButtons';
import AuthDivider from './AuthDivider';
import EmailPasswordForm from './EmailPasswordForm';
import UserTypeSelection from './UserTypeSelection';
import AdditionalAuthOptions from './AdditionalAuthOptions';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  userType: 'client' | 'barber';
  setUserType: (userType: 'client' | 'barber') => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  onAppleAuth: () => Promise<void>;
  onForgotPassword: () => void;
  onGuestLogin: () => void;
  onToggleMode: () => void;
}

const AuthForm = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  userType,
  setUserType,
  loading,
  onSubmit,
  onGoogleAuth,
  onAppleAuth,
  onForgotPassword,
  onGuestLogin,
  onToggleMode
}: AuthFormProps) => {
  return (
    <>
      <SocialAuthButtons 
        onGoogleAuth={onGoogleAuth}
        onAppleAuth={onAppleAuth}
      />
      <AuthDivider />
      
      {!isLogin && (
        <UserTypeSelection
          selectedUserType={userType}
          onUserTypeChange={setUserType}
        />
      )}
      
      <EmailPasswordForm
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        onSubmit={onSubmit}
      />
      <AdditionalAuthOptions
        isLogin={isLogin}
        onForgotPassword={onForgotPassword}
        onGuestLogin={onGuestLogin}
        onToggleMode={onToggleMode}
      />
    </>
  );
};

export default AuthForm;
