import React from "react";

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
    <div className="spinner animate-spin h-16 w-16 border-4 border-t-4 border-blue-500 rounded-full"></div>
  </div>
);

export default LoadingScreen;
