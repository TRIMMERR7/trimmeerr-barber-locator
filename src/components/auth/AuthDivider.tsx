
import React from 'react';

const AuthDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/20"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 text-gray-300">or use email</span>
      </div>
    </div>
  );
};

export default AuthDivider;
