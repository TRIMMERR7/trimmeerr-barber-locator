import React, { useState, useEffect } from 'react';
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
  const [logoAnimated, setLogoAnimated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Trigger logo animation after component mounts
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Animated Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div 
              className={`relative transition-all duration-1000 ease-out ${
                logoAnimated 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-50 rotate-12'
              }`}
            >
              <img 
                src="/lovable-uploads/abac59f0-abe1-4bf5-96ba-c379b41fbbd4.png" 
                alt="TRIMMERR Logo" 
                className="w-12 h-12 transition-transform duration-500 hover:scale-110"
              />
              {/* Animated glow effect */}
              <div 
                className={`absolute inset-0 w-12 h-12 bg-red-500/30 rounded-lg blur-lg transition-all duration-1000 ${
                  logoAnimated ? 'opacity-50 animate-pulse' : 'opacity-0'
                }`}
              />
            </div>
            <h1 
              className={`text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${
                logoAnimated 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              TRIMMERR
            </h1>
          </div>
          <p 
            className={`text-gray-400 text-lg transition-all duration-1000 delay-500 ${
              logoAnimated 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            Book your perfect barber in seconds
          </p>
        </div>

        <Card 
          className={`glass-card border-gray-800 transition-all duration-1000 delay-700 ${
            logoAnimated 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-white text-2xl font-semibold">
              {isLogin ? 'Sign In to Book' : 'Get Started - It\'s Free!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Google Login for fastest experience */}
            <Button 
              type="button"
              onClick={handleGoogleAuth}
              className="w-full h-14 text-base bg-white hover:bg-gray-100 text-black rounded-xl touch-manipulation font-semibold"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">or use email</span>
              </div>
            </div>

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
                    className="bg-gray-800 border-gray-700 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isLogin ? "Enter password" : "Create password (6+ characters)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-12 text-base rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  minLength={!isLogin ? 6 : undefined}
                />
              </div>

              {/* Auth Button */}
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-base font-semibold rounded-xl transition-all touch-manipulation shadow-lg"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In & Book' : 'Create Account & Start Booking')}
              </Button>
            </form>

            {/* Toggle between login and signup */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:text-red-400 text-base font-medium transition-colors"
              >
                {isLogin ? "New here? Create free account" : "Have an account? Sign in"}
              </button>
            </div>

            {/* Benefits for new users */}
            {!isLogin && (
              <div className="bg-gray-800/50 rounded-xl p-4 mt-6">
                <h3 className="text-white font-semibold mb-2">Why join TRIMMERR?</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ Find top barbers near you</li>
                  <li>✓ Book appointments instantly</li>
                  <li>✓ Read reviews from other clients</li>
                  <li>✓ Get directions to barbershops</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
