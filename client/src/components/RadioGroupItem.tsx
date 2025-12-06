import clsx from "clsx";
import React from "react";

export interface RadioGroupItemProps {
  value: string;
  checked: boolean;
  disabled?: boolean;
  isFirst?: boolean;
  hasChecked?: boolean;
  onSelect?: (value: string) => void;
  children: React.ReactNode;
}

export function RadioGroupItem({
  value,
  checked,
  disabled = false,
  isFirst = false,
  hasChecked = false,
  onSelect,
  children,
}: RadioGroupItemProps) {
  const tabIndex = checked ? 0 : !hasChecked && isFirst ? 0 : -1;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={tabIndex}
      className={clsx(
        "radio-btn",
        checked && "selected",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onSelect?.(value)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect?.(value);
        }
      }}
    >
      <span className="radio-icon">
        {checked && <span className="radio-dot" />}
      </span>

      <span className="radio-label">{children}</span>
    </button>
  );
}
