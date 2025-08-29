import React from "react";

// Simple stub for framer-motion used when the real library is unavailable.
export const motion: any = new Proxy(
  {},
  {
    get: () => (props: any) => <div {...props} />,
  }
);

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
