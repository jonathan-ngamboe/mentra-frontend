import { TypingAnimation } from '@/components/magicui/typing-animation';
import { Dictionary } from '@/types/dictionary';

type InfoPanelProps = {
  dictionary: Dictionary;
};

export function InfoPanel({ dictionary }: InfoPanelProps) {
  return (
    <h3 className="text-2xl font-bold pointer-events-auto">
      <TypingAnimation delay={3000}>{`${dictionary.welcome} 👋`}</TypingAnimation>
    </h3>
  );
}
