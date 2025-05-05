import { RiasecDimension, RiasecScores } from '@/types/riasec';
import { Resource, RawResourceDbData } from '@/types/resource';

export type BaseProfession = {
  id: number;
  name: string;
  option?: string | null;
  description?: string | null;
  activitySector?: string | null;
  minDuration?: number | null;
  maxDuration?: number | null;
  effectiveDate?: string | null;
};

export type ProfessionMatch = Profession & {
  correlation: number;
};

export type Profession = BaseProfession & {
  riasecScores: RiasecScores[];
  resources: Resource[]; 
};

export type RawProfessionDbData = {
  id: number;
  name: string | null;
  option?: string | null;
  description?: string | null;
  activity_sector?: string | null;
  min_duration?: number | null;
  max_duration?: number | null;
  effective_date?: string | null;
  riasec_evaluation: Array<{
    score: number | null;
    riasec_dimension: Array<{
      id: number;
      name: RiasecDimension | null;
    }>;
  }>;
  resource: RawResourceDbData;
};
