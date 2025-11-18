"use client";

import { Toaster } from "@/components/ui/sonner";

// Configuration object for toaster
const toasterConfig = {
  position: "bottom-center" as const,
  toastOptions: {
    duration: 4000
  }
} as const;

export const ToastProvider = () => {
  return <Toaster {...toasterConfig} />;
};
