'use client';

import { Dictionary } from '@/types/dictionary';
import { BlurModal } from '@/components/BlurModal';
import { useTransitionNavigation } from '@/components/transitions';

type TestContentProps = {
  dictionary: Dictionary;
};

export function TestContent({ dictionary }: TestContentProps) {
  const { navigateWithTransition } = useTransitionNavigation();

  const handleClose = () => {
    navigateWithTransition('/services');
  };

  return (
    <BlurModal onClose={handleClose} vertical="center" horizontal="center">
      <h3 className="text-2xl font-bold">{dictionary.pageUnderConstruction}</h3>
    </BlurModal>
  );
}
