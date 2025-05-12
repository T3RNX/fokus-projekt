"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { cn } from "../../../frontend/src/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, disabled = false, className }) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div ref={selectRef} className={cn("relative", className)}>
        <SelectTrigger
          onClick={() => !disabled && setOpen(!open)}
          className={className}
          disabled={disabled}
        >
          {React.Children.toArray(children).find(
            (child) =>
              React.isValidElement(child) && child.props.value === value
          ) || <SelectValue placeholder="Auswählen..." />}
          <ChevronDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 opacity-50",
              open && "rotate-180"
            )}
          />
        </SelectTrigger>
        {open && (
          <SelectContent>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectItem) {
                return React.cloneElement(
                  child as React.ReactElement<SelectItemProps>,
                  {
                    onSelect: () => {
                      onValueChange(child.props.value);
                      setOpen(false);
                    },
                    isSelected: child.props.value === value,
                  }
                );
              }
              return child;
            })}
          </SelectContent>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff6c3e] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue = ({ placeholder }: SelectValueProps) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

SelectValue.displayName = "SelectValue";

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-md animate-in fade-in-80",
        className
      )}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  )
);

SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, onSelect, isSelected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={onSelect}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
);

SelectItem.displayName = "SelectItem";
