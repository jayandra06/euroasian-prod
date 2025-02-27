// components/ErrorBoundary.tsx
"use client";
import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  isErrorMode: boolean;
}

interface State {
  hasError: boolean;
  loadingProgress: number;
}

class ErrorBoundary extends Component<Props, State> {
  private progressInterval: NodeJS.Timeout | null = null;
  
  public state: State = {
    hasError: false,
    loadingProgress: 0
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true, loadingProgress: 0 };
  }

  public static getDerivedStateFromProps(props: Props): State | null {
    if (props.isErrorMode) {
      throw new Error("FATAL_SYSTEM_ERROR");
    }
    return null;
  }

  componentDidMount() {
    if (this.state.hasError) {
      this.startLoadingProgress();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isErrorMode && this.props.isErrorMode) {
      this.startLoadingProgress();
    }
  }

  componentWillUnmount() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  startLoadingProgress = () => {
    this.progressInterval = setInterval(() => {
      this.setState(prev => ({
        loadingProgress: Math.min(prev.loadingProgress + Math.random() * 5, 99)
      }));
    }, 200);
  };

  getRandomHexValue = () => {
    return Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  };

  getRandomMemoryAddress = () => {
    return `0x${Array(8).fill(0).map(() => this.getRandomHexValue()).join('')}`;
  };

  render() {
    if (this.state.hasError || this.props.isErrorMode) {
      const memoryAddresses = Array(8).fill(0).map(this.getRandomMemoryAddress);
      const errorCodes = [
        'MEMORY_MANAGEMENT_ERROR',
        'CRITICAL_PROCESS_DIED',
        'SYSTEM_THREAD_EXCEPTION',
        'UNEXPECTED_KERNEL_MODE_TRAP',
        'SYSTEM_SERVICE_EXCEPTION'
      ];

      return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-8 overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse mb-8">
              <h1 className="text-red-500 text-4xl mb-2">FATAL_ERROR_DETECTED</h1>
              <p className="text-xl text-red-400">System has encountered a critical error</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-yellow-500 mb-2">MEMORY_DUMP_IN_PROGRESS...</p>
                <div className="bg-gray-900 p-4 rounded">
                  {memoryAddresses.map((addr, i) => (
                    <p key={i} className="font-mono text-sm opacity-80">
                      {addr}: {Array(8).fill(0).map(this.getRandomHexValue).join(' ')}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-yellow-500">STACK_TRACE:</p>
                <div className="bg-gray-900 p-4 rounded animate-pulse">
                  {errorCodes.map((code, i) => (
                    <p key={i} className="text-sm opacity-80">
                      {code} at {this.getRandomMemoryAddress()}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-yellow-500 mb-2">SYSTEM_ANALYSIS:</p>
                <div className="space-y-2">
                  <p>● Kernel panic detected</p>
                  <p>● Critical system files compromised</p>
                  <p>● Development mode initialization failed</p>
                  <p className="animate-pulse">● Attempting recovery procedures...</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-red-500 animate-pulse">
                  RECOVERY_PROGRESS: {this.state.loadingProgress.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-900 h-2 mt-2">
                  <div 
                    className="bg-red-500 h-full transition-all duration-200"
                    style={{ width: `${this.state.loadingProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 text-sm opacity-70">
                <p>Technical information:</p>
                <p>*** STOP: 0x000000D1 (0x0000000C,0x00000002,0x00000000,0xF86B5A89)</p>
                <p>*** kernel_security_check_failure</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;