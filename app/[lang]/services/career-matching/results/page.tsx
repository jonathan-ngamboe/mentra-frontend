import { Dictionary } from '@/types/dictionary';

type ResultsProps = {
  dictionary: Dictionary;
};

export function Results({ dictionary }: ResultsProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center uppercase">
      <h3>{dictionary.pageUnderConstruction}</h3>
    </div>
  );
}
