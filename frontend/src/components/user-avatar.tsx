import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/user-display';

interface UserAvatarProps {
  name?: string;
  src?: string | null;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({ name, src, className, textClassName }: UserAvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = !!src && !broken;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cn('rounded-full object-cover', className)}
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium',
        className,
      )}
      aria-label={name ?? 'Avatar'}
    >
      <span className={cn('text-xs', textClassName)}>{getInitials(name)}</span>
    </div>
  );
}
