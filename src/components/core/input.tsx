import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Type-safe and accessible Text Input field primitive.
 * Connects forward refs to play nicely with uncontrolled state engines or server components.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-700 tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 font-medium placeholder:text-slate-400 text-base",
            "shadow-sm transition-colors duration-150 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            {
              "border-rose-500 focus:border-rose-500 focus:ring-rose-500": error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-semibold text-rose-500 tracking-normal animate-in fade-in-50 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";