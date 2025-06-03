
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
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
            description: "You're ready to book appointments.",
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
              user_type: 'client'
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

  const handleGuestLogin = () => {
    // For demo purposes, we'll create a guest user experience
    toast({
      title: "Guest Mode",
      description: "Browsing as guest - limited features available",
      duration: 2000
    });
    // You can implement actual guest functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
              alt="TRIMMERR Logo" 
              className="w-12 h-12"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              TRIMMERR
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Book your perfect barber in seconds</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-white text-2xl font-semibold">
              {showForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In to Book' : 'Get Started - It\'s Free!')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Label htmlFor="email" className="text-white text-base mb-2 block">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/90 hover:to-red-800/90 text-white h-12 text-base font-semibold rounded-xl transition-all backdrop-blur-sm border border-white/20"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-red-400 hover:text-red-300 text-base font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <>
                {/* Quick Google Login */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Button 
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full h-12 text-base bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold backdrop-blur-sm border border-white/20"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 text-gray-300">or use email</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white text-base">Your Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-base">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white text-base">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={isLogin ? "Enter password" : "Create password (6+ characters)"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                        required
                        minLength={!isLogin ? 6 : undefined}
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/90 hover:to-red-800/90 text-white h-12 text-base font-semibold rounded-xl transition-all backdrop-blur-sm border border-white/20"
                    >
                      {loading ? 'Please wait...' : (isLogin ? 'Sign In & Book' : 'Create Account & Start Booking')}
                    </Button>
                  </form>
                </div>

                {/* Additional Options */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="w-full text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Forgot your password?
                    </button>
                  )}
                  
                  <Button
                    onClick={handleGuestLogin}
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-white/10 rounded-xl h-10 border border-white/20 backdrop-blur-sm"
                  >
                    Continue as Guest
                  </Button>
                </div>

                {/* Toggle between login and signup */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-red-400 hover:text-red-300 text-base font-medium transition-colors"
                  >
                    {isLogin ? "New here? Create free account" : "Have an account? Sign in"}
                  </button>
                </div>

                {/* Benefits for new users */}
                {!isLogin && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Why join TRIMMERR?</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>✓ Find top barbers near you</li>
                      <li>✓ Book appointments instantly</li>
                      <li>✓ Read reviews from other clients</li>
                      <li>✓ Get directions to barbershops</li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
