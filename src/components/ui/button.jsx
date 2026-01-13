import React from "react";

export function Button({ className = "", variant = "default", children, ...props }) {
  const base = "btn " + (variant === "primary" ? "btnPrimary " : "") + (variant === "danger" ? "btnDanger " : "");
  return (
    <button className={base + className} {...props}>
      {children}
    </button>
  );
}
