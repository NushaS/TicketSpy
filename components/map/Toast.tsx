import React from 'react';
import { Check, X } from 'lucide-react';
import styles from '@/app/page.module.css';

type ToastProps = {
  variant: 'success' | 'error';
  message: string;
  iconSize?: number;
};

const Toast: React.FC<ToastProps> = ({ variant, message, iconSize = 20 }) => {
  const Icon = variant === 'success' ? Check : X;
  const className = variant === 'success' ? styles.successToast : styles.errorToast;

  return (
    <div className={className}>
      <Icon size={iconSize} />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
