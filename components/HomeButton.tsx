'use client';

import { useTransitionNavigation } from '@/components/transitions';
import { RainbowButton } from '@/components/magicui/rainbow-button';

type HomeButtonProps = {
  cta: string;
  link: string;
  props?: React.HTMLAttributes<HTMLButtonElement>;
};

export function HomeButton({ link, cta, ...props }: HomeButtonProps) {
  const { navigateWithTransition } = useTransitionNavigation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigateWithTransition(link);
  };

  return (
    <RainbowButton onClick={handleClick} {...props}>
      {cta}
    </RainbowButton>
  );
}
