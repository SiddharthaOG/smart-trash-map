import React from 'react';

export function Card({ children, className = '', as = 'div', ...rest }) {
  const Component = as;
  return (
    <Component
      className={`bg-white rounded-xl border border-slate-200 shadow-xs ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}

export default Card;
