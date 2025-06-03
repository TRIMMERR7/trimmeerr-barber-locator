
import React from 'react';

const AuthHeader = () => {
  return (
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
  );
};

export default AuthHeader;
