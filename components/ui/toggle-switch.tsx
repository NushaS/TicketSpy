'use client';
import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <Switch.Root
      className={cn(
        'w-12 h-6 bg-gray-300 rounded-full relative shadow-inner transition-colors data-[state=checked]:bg-[#93A58D] flex-shrink-0'
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <Switch.Thumb
        className={cn(
          'block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform data-[state=checked]:translate-x-6'
        )}
      />
    </Switch.Root>
  );
};

export default ToggleSwitch;
