
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { validateEmail, sanitizeInput } from '@/utils/securityHelpers';

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (
    e: React.FormEvent,
    isLogin: boolean,
    email: string,
    password: string,
    fullName: string,
    userType: 'client' | 'barber'
  ) => {
    e.preventDefault();
    
    // Input validation
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    const sanitizedFullName = sanitizeInput(fullName.trim());

    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login for:', sanitizedEmail);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password
        });

        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
            duration: 3000
          });
        } else {
          console.log('Login successful for user:', data.user?.id);
          toast({
            title: "Welcome back!",
            description: "You're successfully logged in.",
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

        console.log('Attempting signup for:', sanitizedEmail, 'as', userType);
        const { data, error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: sanitizedFullName,
              user_type: userType
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
            duration: 3000
          });
        } else {
          console.log('Signup successful for user:', data.user?.id);
          localStorage.setItem('userType', userType);
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Auth handler error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000
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
          duration: 3000
        });
      } else {
        toast({
          title: "Check your email",
          description: "Password reset link has been sent.",
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000
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
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000
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
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 3000
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
