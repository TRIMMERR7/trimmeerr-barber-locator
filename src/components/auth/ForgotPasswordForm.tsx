
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
}

const ForgotPasswordForm = ({
  email,
  setEmail,
  loading,
  onSubmit,
  onBack
}: ForgotPasswordFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        onClick={onBack}
        className="w-full text-red-400 hover:text-red-300 text-base font-medium transition-colors"
      >
        Back to Sign In
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
