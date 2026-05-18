import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium text-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
          "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          "h-12 px-6 py-3 w-full sm:w-auto", 
          {
            // New Dark Theme Styles
            "bg-gradient-to-r from-violet-700 to-purple-600 text-white shadow-[0_0_20px_-5px_rgba(109,40,217,0.4)] hover:from-violet-600 hover:to-purple-500": 
              variant === "primary",
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700": 
              variant === "secondary",
            "border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300": 
              variant === "outline",
            "bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100": 
              variant === "ghost",
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