
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailPasswordFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const EmailPasswordForm = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  onSubmit
}: EmailPasswordFormProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <form onSubmit={onSubmit} className="space-y-4">
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
  );
};

export default EmailPasswordForm;
