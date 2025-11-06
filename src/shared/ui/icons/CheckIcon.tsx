import DoneSvg from '@shared/assets/images/done.svg?react';

interface CheckIconProps {
  className?: string;
}

export function CheckIcon({ className }: CheckIconProps) {
  return <DoneSvg className={className} aria-hidden="true" />;
}
