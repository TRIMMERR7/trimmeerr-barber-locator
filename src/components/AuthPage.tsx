
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import AuthHeader from './auth/AuthHeader';
import SocialAuthButtons from './auth/SocialAuthButtons';
import AuthDivider from './auth/AuthDivider';
import EmailPasswordForm from './auth/EmailPasswordForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import AdditionalAuthOptions from './auth/AdditionalAuthOptions';
import UserTypeSelection from './auth/UserTypeSelection';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'client' | 'barber'>('client');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
            duration: 2000
          });
        } else {
          toast({
            title: "Welcome back!",
            description: userType === 'barber' ? "Ready to manage your clients!" : "You're ready to book appointments.",
            duration: 1500
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              user_type: userType
            }
          }
        });

        if (error) {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
            duration: 2000
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
            duration: 2000
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
          duration: 2000
        });
      } else {
        toast({
          title: "Check your email",
          description: "Password reset link has been sent to your email.",
          duration: 3000
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
          duration: 2000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleAppleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
          duration: 2000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Guest Mode",
      description: "Browsing as guest - limited features available",
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader />

        <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-white text-2xl font-semibold">
              {showForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In to Book' : 'Get Started - It\'s Free!')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {showForgotPassword ? (
              <ForgotPasswordForm
                email={email}
                setEmail={setEmail}
                loading={loading}
                onSubmit={handleForgotPassword}
                onBack={() => setShowForgotPassword(false)}
              />
            ) : (
              <>
                <SocialAuthButtons 
                  onGoogleAuth={handleGoogleAuth}
                  onAppleAuth={handleAppleAuth}
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
                  onSubmit={handleAuth}
                />
                <AdditionalAuthOptions
                  isLogin={isLogin}
                  onForgotPassword={() => setShowForgotPassword(true)}
                  onGuestLogin={handleGuestLogin}
                  onToggleMode={() => setIsLogin(!isLogin)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
