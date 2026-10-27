import React from 'react';

const VARIANTS = {
  primary: 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white shadow-sm border border-emerald-900 focus-visible:ring-emerald-700',
  secondary: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 focus-visible:ring-emerald-600',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs focus-visible:ring-emerald-600',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus-visible:ring-emerald-600',
  danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm focus-visible:ring-rose-600',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-lg gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  title,
  ariaLabel,
  icon: Icon,
  ...rest
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer transition-colors duration-150 active:scale-[0.99]';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`inline-flex items-center justify-center font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;
