import { Dictionary } from '@/types/dictionary';

export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecScores = {
  [key in RiasecKey]: number;
};

export type ProfessionMatch = {
  id: number;
  name: string;
  correlation: number;
};

export type RiasecResultsProps = {
  profile: RiasecScores;
  professionMatches: ProfessionMatch[];
  dictionary: Dictionary;
};

export type RiasecResults = {
  profile: RiasecScores;
  professions: ProfessionMatch[];
};
