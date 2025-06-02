
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LoginPageProps {
  onLogin: (type: 'barber' | 'client' | 'guest') => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'barber' | 'client'>('client');

  const handleLogin = () => {
    // Simulate login - in real app, this would authenticate with backend
    onLogin(userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-trimmer-dark via-trimmer-slate to-trimmer-slate-light flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">TRIMMERR</h1>
          <p className="text-slate-400">Find your perfect barber</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center text-white">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Toggle */}
            <div className="flex rounded-lg bg-trimmer-slate p-1">
              <button
                onClick={() => setUserType('client')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === 'client' 
                    ? 'bg-trimmer-blue text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => setUserType('barber')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === 'barber' 
                    ? 'bg-trimmer-red text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Barber
              </button>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-trimmer-slate border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-trimmer-slate border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className={`w-full font-semibold ${
                userType === 'client' 
                  ? 'bg-trimmer-blue hover:bg-blue-600' 
                  : 'bg-trimmer-red hover:bg-red-600'
              }`}
            >
              Sign In as {userType === 'client' ? 'Client' : 'Barber'}
            </Button>

            <Separator className="bg-slate-600" />

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-white text-black border-0 hover:bg-gray-100">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full bg-black text-white border-slate-600 hover:bg-gray-900">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => onLogin('guest')}
                className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
