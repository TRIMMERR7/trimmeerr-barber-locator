
import React from 'react';

const StepsIndicator = () => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">✓</div>
          <span className="text-white font-medium hidden sm:inline">Find</span>
        </div>
        <div className="w-8 h-px bg-white"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-white font-medium hidden sm:inline">Select</span>
        </div>
        <div className="w-8 h-px bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-gray-400 hidden sm:inline">Book</span>
        </div>
      </div>
    </div>
  );
};

export default StepsIndicator;
