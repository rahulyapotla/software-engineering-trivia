import clsx from "clsx";
import React from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";
const defaultElement = "button";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary: "btn-tertiary",
};

const sizeClasses = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export function Button({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ariaLabel,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const Element = as || defaultElement;

  const isIconOnly = !children && (iconLeft || iconRight);

  return (
    <Element
      {...props}
      aria-label={ariaLabel}
      className={clsx(
        "btn",
        variantClasses[variant],
        sizeClasses[size],
        isIconOnly && "btn-icon-only",
        className
      )}
    >
      {iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
      {children && <span className="btn-label">{children}</span>}
      {iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </Element>
  );
}
