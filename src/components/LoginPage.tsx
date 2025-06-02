
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
    onLogin(userType);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">TRIMMERR</h1>
          <p className="text-gray-400">Find your perfect barber</p>
        </div>

        <Card className="bg-black border border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-white text-xl font-medium">Step 1</CardTitle>
            <p className="text-center text-white text-lg">Login / Sign Up</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Toggle */}
            <div className="flex rounded-lg bg-gray-900 p-1">
              <button
                onClick={() => setUserType('client')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === 'client' 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => setUserType('barber')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === 'barber' 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Barber
              </button>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-lg h-12"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-lg h-12"
              />
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full font-semibold bg-red-600 hover:bg-red-700 text-white h-12 rounded-lg"
            >
              Log In
            </Button>

            <div className="text-center">
              <span className="text-gray-400 text-sm">Don't have an account? </span>
              <button className="text-white text-sm underline">Sign Up</button>
            </div>

            <Separator className="bg-gray-700" />

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-white text-black border-0 hover:bg-gray-100 h-12 rounded-lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full bg-black text-white border-gray-700 hover:bg-gray-900 h-12 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => onLogin('guest')}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-900 h-12 rounded-lg"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
