import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    { className, type = "text", label, icon, placeholder, id, ...props },
    ref,
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="flex flex-col gap-3 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans font-bold text-sm text-main-text tracking-[0.14px] leading-5"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={cn(
              "w-full pr-3 py-[13px] rounded-lg border bg-main-bg font-sans text-base text-main-text transition-colors",
              "focus:outline-none focus:ring-2 transition-all",
              icon ? "pl-[45px]" : "pl-3",
              "border-brand-border focus:ring-brand-green/30 focus:border-brand-green placeholder:text-brand-muted",
              className,
            )}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
