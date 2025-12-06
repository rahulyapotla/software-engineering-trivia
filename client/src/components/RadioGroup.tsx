import React from "react";

interface RadioGroupProps {
  value: string;
  onValueChange: (val: string) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  ariaLabel,
  ariaLabelledBy,
  required = false,
  children,
  className,
}: RadioGroupProps) {
  const items = React.Children.toArray(children);

  const hasChecked = items.some(
    (child) => React.isValidElement(child) && child.props.checked
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex(
      (child) => React.isValidElement(child) && child.props.value === value
    );

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      const next = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;

      const nextChild = items[next];
      if (React.isValidElement(nextChild)) {
        onValueChange(nextChild.props.value);
      }
      e.preventDefault();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      const prev =
        currentIndex === -1
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;

      const prevChild = items[prev];
      if (React.isValidElement(prevChild)) {
        onValueChange(prevChild.props.value);
      }
      e.preventDefault();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-required={required}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {items.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child, {
          isFirst: index === 0,
          hasChecked,
          onSelect: onValueChange,
        });
      })}
    </div>
  );
}
