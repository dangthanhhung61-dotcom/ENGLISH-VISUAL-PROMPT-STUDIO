import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts?: ToastMessage[];
  message?: ToastMessage;
  onDismiss: (id: string) => void;
}

export interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  let bgColor = 'bg-slate-900 text-white';
  let iconColor = 'text-emerald-300';
  let Icon = CheckCircle;

  if (toast.type === 'success') {
    bgColor = 'bg-emerald-800 text-white border border-emerald-700 shadow-lg';
    iconColor = 'text-emerald-200';
    Icon = CheckCircle;
  } else if (toast.type === 'error') {
    bgColor = 'bg-rose-800 text-white border border-rose-700 shadow-lg';
    iconColor = 'text-rose-200';
    Icon = AlertCircle;
  } else if (toast.type === 'info') {
    bgColor = 'bg-blue-800 text-white border border-blue-700 shadow-lg';
    iconColor = 'text-blue-200';
    Icon = Info;
  }

  return (
    <div
      id={`toast-${toast.id}`}
      className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all transform duration-200 ease-out shadow-md ${bgColor}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
        <span>{toast.text}</span>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors ml-2"
        title="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toast: React.FC<ToastProps> = ({ toasts, message, onDismiss }) => {
  if (message) {
    return <ToastItem toast={message} onDismiss={onDismiss} />;
  }

  const items = Array.isArray(toasts) ? toasts : [];
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
