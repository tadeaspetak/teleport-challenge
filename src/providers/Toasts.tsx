import React, { ReactNode, useCallback, useContext, useState } from "react";

import { getRandomString } from "../utils";

export type ToastType = "info" | "success" | "error";
export interface Toast {
  id: string;
  body: string;
  type: ToastType;
  hideIn: number;
}
interface ToastOptions {
  id?: string;
  hideIn?: number;
}

type ToastContextType = {
  toasts: Toast[];
  add: (body: string, type: ToastType, options?: ToastOptions) => void;
  remove: (id: string) => void;
};

export const ToastContext = React.createContext<ToastContextType>(null!);

const rm = (toasts: Toast[], id: string) => {
  const index = toasts.findIndex((n) => n.id === id);
  if (index < 0) return toasts;

  const next = [...toasts];
  next.splice(index, 1);
  return next;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([
    {
      id: "success",
      body: "I am successful. This is a wonderful message.",
      type: "success",
      hideIn: 0,
    },
    {
      id: "error",
      body: "I am erroneous. This is a wonderful message.",
      type: "error",
      hideIn: 0,
    },
    {
      id: "info",
      body: "I am informative. This is a wonderful mess, oh really yes!",
      type: "info",
      hideIn: 0,
    },
  ]);

  const remove = useCallback((id: string) => setToasts(rm(toasts, id)), [toasts]);

  const add = useCallback(
    (body: string, type: ToastType, { id, hideIn = 5000 }: ToastOptions = {}) => {
      const next = id ? rm(toasts, id) : toasts;
      setToasts([...next, { id: id || getRandomString(6), body, type, hideIn }]);
    },
    [toasts],
  );

  return <ToastContext.Provider value={{ toasts, add, remove }}>{children}</ToastContext.Provider>;
};

export function useToasts() {
  return useContext(ToastContext);
}
