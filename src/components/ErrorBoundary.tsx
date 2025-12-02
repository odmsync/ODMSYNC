
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { analytics } from '@/utils/analytics';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  static displayName = 'ErrorBoundary';
  
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for tracking
    analytics.track('error_boundary_caught', {
      message: error.message,
      stack: errorInfo.componentStack?.substring(0, 500), // Limit stack trace size
    });
    
    // Use logger utility for consistent error logging
    logger.error('Uncaught error in ErrorBoundary', { error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-gray-50 text-center rounded-xl border border-gray-200 my-8">
          <div className="bg-red-100 p-4 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 max-w-md mb-8">
            We encountered an unexpected error. Our team has been notified. 
            Please try refreshing the page.
          </p>
          
          {import.meta.env.DEV && this.state.error && (
            <pre className="bg-gray-900 text-red-300 p-4 rounded-lg text-left text-xs overflow-auto w-full max-w-2xl mb-8 max-h-48">
              {this.state.error.toString()}
            </pre>
          )}

          <button
            onClick={this.handleReload}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
