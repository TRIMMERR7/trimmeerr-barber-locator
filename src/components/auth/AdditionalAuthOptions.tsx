
import React from 'react';
import { Button } from "@/components/ui/button";

interface AdditionalAuthOptionsProps {
  isLogin: boolean;
  onForgotPassword: () => void;
  onGuestLogin: () => void;
  onToggleMode: () => void;
}

const AdditionalAuthOptions = ({
  isLogin,
  onForgotPassword,
  onGuestLogin,
  onToggleMode
}: AdditionalAuthOptionsProps) => {
  return (
    <>
      {/* Additional Options */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
        {isLogin && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Forgot your password?
          </button>
        )}
        
        <Button
          onClick={onGuestLogin}
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
          onClick={onToggleMode}
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
  );
};

export default AdditionalAuthOptions;
