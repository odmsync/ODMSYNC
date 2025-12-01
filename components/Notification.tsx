
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { TIMEOUTS } from '../constants';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ id, type, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, TIMEOUTS.NOTIFICATION_AUTO_CLOSE);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // handleClose is stable, no need to include in deps

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, TIMEOUTS.NOTIFICATION_EXIT_ANIMATION);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-blue-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  const styles = {
    success: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div
      className={`flex items-start p-4 rounded-lg border shadow-lg mb-3 transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${styles[type]} max-w-md w-full pointer-events-auto`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

Notification.displayName = 'Notification';

/**
 * Simple Event Bus for Notifications (to avoid complex Context for this demo)
 */
export type NotifyCallback = (n: { type: NotificationType; message: string }) => void;
let notifyListeners: NotifyCallback[] = [];

export const notify = (type: NotificationType, message: string) => {
  notifyListeners.forEach((l) => l({ type, message }));
};

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Array<{ id: string; type: NotificationType; message: string }>>([]);

  useEffect(() => {
    const handler: NotifyCallback = (n) => {
      setNotifications((prev) => [...prev, { ...n, id: Date.now().toString() + Math.random() }]);
    };
    notifyListeners.push(handler);
    return () => {
      notifyListeners = notifyListeners.filter((l) => l !== handler);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, removeNotification };
};
