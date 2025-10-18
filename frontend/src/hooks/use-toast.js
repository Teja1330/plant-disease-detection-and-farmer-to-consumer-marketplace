// hooks/use-toast.js
import { useState, useCallback } from "react";

// Simple toast implementation that uses browser alerts as fallback
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    // Fallback to alert if no toast UI is available
    if (typeof window !== "undefined") {
      if (variant === "destructive") {
        alert(`❌ ${title}\n${description}`);
      } else {
        alert(`✅ ${title}\n${description}`);
      }
    }

    // For actual toast implementation (commented out for now)
    /*
    const newToast = {
      id: Date.now(),
      title,
      description,
      variant,
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
    */
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toast,
    toasts,
    removeToast,
  };
};