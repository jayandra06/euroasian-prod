"use client";
import React, { useEffect, useState } from "react";

const ErrorScreen = () => {
  const [errorDump, setErrorDump] = useState<string[]>([]);
  const apiEndpoints = ["/api/dis", "/api/red", "/api/error"];

  useEffect(() => {
    // Simulate API spam in the console
    const logInterval = setInterval(() => {
      const endpoint = apiEndpoints[Math.floor(Math.random() * apiEndpoints.length)];
      const time = Math.floor(Math.random() * 10) + 5; // Random response time (5ms - 15ms)
      // console.log(`GET ${endpoint} 200 in ${time}ms`);
    }, 300); // Log every 300ms to mimic high request traffic

    // Simulate error log updates
    const errorInterval = setInterval(() => {
      setErrorDump((prev) => [
        ...prev.slice(-10), // Keep only last 10 logs
        `ERR_${Math.random().toString(16).slice(2, 8).toUpperCase()} | TIMEOUT`,
      ]);
    }, 800);

    return () => {
      clearInterval(logInterval);
      clearInterval(errorInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-red-500 flex flex-col items-center justify-center p-4 z-[9999]">
      <h1 className="text-4xl font-bold mb-4 animate-pulse">🚨 System Error</h1>
      <div className="font-mono text-lg space-y-2 text-center">
        <p className="animate-bounce">Entering Development Mode....</p>
        <p className="text-xl font-bold mt-4 animate-pulse text-yellow-400">
          ⚠ Too Many Requests ⚠
        </p>
        <p className="text-sm text-gray-400">Server Overload Detected...</p>
        <p className="text-sm text-gray-400">Network Response: 504 Gateway Timeout</p>
        <div className="mt-8 text-xs opacity-50 text-left bg-black/20 p-2 border-l-2 border-red-500">
          <p>Process terminated unexpectedly</p>
          <p>Memory dump in progress...</p>
          {errorDump.map((err, i) => (
            <p key={i} className="opacity-30 animate-pulse">
              {err}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
