import { Dictionary } from '@/types/dictionary';
import { ProfessionMatch } from '@/types/profession';

export type RiasecDimension = {
  id: number;
  name: string;
  description?: string | null;
};

export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type RiasecScores = {
  [key in RiasecKey]: number;
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

export const dimensionNameToKeyMap: Record<string, keyof RiasecScores> = {
  Realistic: 'R',
  Investigative: 'I',
  Artistic: 'A',
  Social: 'S',
  Enterprising: 'E',
  Conventional: 'C',
};

export const riasecLetterToName: { [key in keyof RiasecScores]: string } = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};
