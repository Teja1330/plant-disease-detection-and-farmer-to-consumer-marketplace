import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // 5 seconds

// Map to keep track of toast removal timeouts
const toastTimeouts = new Map();

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Function to remove a toast
  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
    if (toastTimeouts.has(toastId)) {
      clearTimeout(toastTimeouts.get(toastId));
      toastTimeouts.delete(toastId);
    }
  }, []);

  // Function to add toast to remove queue
  const addToRemoveQueue = useCallback((toastId) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
      removeToast(toastId);
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
  }, [removeToast]);

  // Function to show a new toast
  const toast = useCallback(
    ({ title, description, type = "info" }) => {
      setToasts((prev) => {
        // Remove oldest toast if limit exceeded
        if (prev.length >= TOAST_LIMIT) {
          const [oldest] = prev;
          removeToast(oldest.id);
          return [...prev.slice(1), { id: uuidv4(), title, description, type }];
        }
        return [...prev, { id: uuidv4(), title, description, type }];
      });
    },
    [removeToast]
  );

  return {
    toasts,
    toast,
    removeToast,
    addToRemoveQueue,
  };
};
