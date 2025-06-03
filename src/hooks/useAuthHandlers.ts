import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { validateEmail, sanitizeInput } from '@/utils/securityHelpers';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setUserType } = useAuth();

  const handleAuth = async (
    e: React.FormEvent,
    isLogin: boolean,
    email: string,
    password: string,
    fullName: string,
    userType: 'client' | 'barber'
  ) => {
    e.preventDefault();
    
    // Enhanced input validation
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    const sanitizedFullName = sanitizeInput(fullName.trim());

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
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
          // Store user type in localStorage for login
          localStorage.setItem('userType', userType);
          setUserType(userType);
          toast({
            title: "Welcome back!",
            description: userType === 'barber' ? "Ready to manage your clients!" : "You're ready to book appointments.",
            duration: 1500
          });
        }
      } else {
        if (!sanitizedFullName) {
          toast({
            title: "Name Required",
            description: "Please enter your full name",
            variant: "destructive",
            duration: 2000
          });
          return;
        }

        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: sanitizedFullName,
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
          // Store user type for signup
          localStorage.setItem('userType', userType);
          setUserType(userType);
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

  const handleForgotPassword = async (email: string) => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
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

  return {
    loading,
    handleAuth,
    handleForgotPassword,
    handleGoogleAuth,
    handleAppleAuth,
    handleGuestLogin
  };
};
