import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

/**
 * Production-grade atomic Button element.
 * Enforces a minimum 44x44px interaction boundary for excellent mobile accessibility.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-all duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
          "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          "min-h-[44px] px-5 py-2.5", // Strict mobile touchscreen target matching
          {
            "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500": variant === "primary",
            "bg-slate-100 text-slate-900 hover:bg-slate-200": variant === "secondary",
            "bg-rose-600 text-white shadow-sm hover:bg-rose-500": variant === "danger",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";