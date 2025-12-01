// Centralized logging utility with production-safe console handling

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
}

class Logger {
  private isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
    };

    // Only log in development or if explicitly enabled
    if (this.isDevelopment) {
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[method](`[${level.toUpperCase()}] ${message}`, data || '');
    }

    // In production, you could send to error tracking service (Sentry, etc.)
    if (level === 'error' && !this.isDevelopment) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(new Error(message), { extra: data });
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown): void {
    this.log('error', message, error);
  }
}

export const logger = new Logger();

