
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
              alt="TRIMMERR Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">TRIMMERR</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Find your perfect barber</p>
        </div>

        <Card className="bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-black text-lg sm:text-xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setUserType('client')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all touch-manipulation ${
                  userType === 'client' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => setUserType('barber')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all touch-manipulation ${
                  userType === 'barber' 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Barber
              </button>
            </div>

            {/* Email */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 h-12 text-base"
            />

            {/* Password */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 h-12 text-base"
            />

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base touch-manipulation"
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 text-base touch-manipulation">
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-12 text-base touch-manipulation">
                Continue with Apple
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onLogin('guest')}
                className="w-full text-gray-600 h-12 text-base touch-manipulation"
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
