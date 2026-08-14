import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
