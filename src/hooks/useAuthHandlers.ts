
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

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

  const handleForgotPassword = async (email: string) => {
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
