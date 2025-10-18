import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const newToast = {
      id: Date.now() + Math.random(),
      title,
      description,
      variant,
    };
    
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    toast,
    toasts: toasts || [], // Ensure toasts is always an array
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};