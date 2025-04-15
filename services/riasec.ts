'use server';

import { createClient } from '@/utils/supabase/server';
import { RiasecResults, RiasecScores, ProfessionMatch } from '@/types/riasec';

/**
 * Converts array of responses to the format expected by the SQL functions
 */
function formatResponses(responses: (number | null)[]): Record<number, number> {
  const formattedResponses: Record<number, number> = {};

  responses.forEach((response, index) => {
    if (response !== null) {
      // Add 1 to index to match question IDs (assuming they start at 1)
      formattedResponses[index + 1] = response;
    }
  });

  return formattedResponses;
}

/**
 * Calculates the complete RIASEC profile and correlations with professions in one step
 */
export async function calculateRiasecResults(responses: (number | null)[]): Promise<RiasecResults> {
  const supabase = await createClient();
  const formattedResponses = formatResponses(responses);

  // Call the SQL function to calculate the RIASEC profile and correlations
  const { data, error } = await supabase.rpc('calculate_riasec_results', {
    answers: formattedResponses,
  });

  if (error) {
    throw new Error(`Error calculating RIASEC results - ${error.message}`);
  }

  return data as RiasecResults;
}

/**
 * Get RIASEC dimension IDs from the database
 */
async function getRiasecDimensionIds(): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('riasec_dimension').select('id, name');

  if (error) {
    throw new Error(`Error fetching RIASEC dimension IDs - ${error.message}`);
  }

  // Créer un mapping de name -> id
  const dimensionIds: Record<string, number> = {};
  data?.forEach((dimension) => {
    dimensionIds[dimension.name] = dimension.id;
  });

  return dimensionIds;
}

/**
 * Get RIASEC dimension names from the database
 */
async function getRiasecDimensionNames(): Promise<Record<number, keyof RiasecScores>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('riasec_dimension').select('id, name');

  if (error) {
    throw new Error(`Error fetching RIASEC dimension names - ${error.message}`);
  }

  const mapping: Record<number, keyof RiasecScores> = {};
  data?.forEach((dim) => {
    mapping[dim.id] = dim.name as keyof RiasecScores;
  });

  return mapping;
}

async function getRiasecDimensions(): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('riasec_dimension').select('id, name');

  if (error) {
    throw new Error(`Error fetching RIASEC dimensions - ${error.message}`);
  }

  const dimensionMap: Record<string, number> = {};
  data?.forEach((dimension) => {
    dimensionMap[dimension.name] = dimension.id;
  });

  return dimensionMap;
}

/**
 * Save the RIASEC results of a user
 */
export async function saveUserRiasecResults(userId: string, profile: RiasecScores): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const RIASEC_DIMENSION_IDS = await getRiasecDimensionIds();

  if (!RIASEC_DIMENSION_IDS) {
    throw new Error('Riasec Dimension IDs not found');
  }

  const letterToFullNameMap: Record<string, string> = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
  };

  // Delete previous results for the user, if any
  const { error: deleteError } = await supabase
    .from('riasec_evaluation')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    throw new Error(`Error deleting old RIASEC results - ${deleteError.message}`);
  }

  // Prepare new results to insert
  const records = Object.entries(profile)
    .map(([dim, score]) => {
      const fullDimName = letterToFullNameMap[dim];

      if (!fullDimName) {
        return null; // Ignore this record if the full name is not found
      }

      const dimensionId = RIASEC_DIMENSION_IDS[fullDimName];

      if (!dimensionId) {
        return null; // Ignore this record if the ID is not found
      }

      return {
        user_id: userId,
        ri_di_is_type_of_id: dimensionId,
        score,
        created_at: now,
        updated_at: now,
        pro_has_id: null,
      };
    })
    .filter(Boolean); // Filter out null values

  if (records.length > 0) {
    const { error: insertError } = await supabase.from('riasec_evaluation').insert(records);
    if (insertError) {
      throw new Error(`Error saving user RIASEC results - ${insertError.message}`);
    }
  }
}

/**
 * Get the RIASEC profile of a user
 */
export async function getUserRiasecResults(userId: string): Promise<RiasecResults | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('riasec_evaluation')
    .select('score, ri_di_is_type_of_id, pro_has_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching user RIASEC results - ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  const idToNameMap = await getRiasecDimensionNames();

  const nameToLetter: Record<string, keyof RiasecScores> = {
    Realistic: 'R',
    Investigative: 'I',
    Artistic: 'A',
    Social: 'S',
    Enterprising: 'E',
    Conventional: 'C',
  };

  const profile: Partial<RiasecScores> = {};
  const professions: ProfessionMatch[] = [];

  for (const row of data) {
    const fullName = idToNameMap[row.ri_di_is_type_of_id];
    if (!fullName) continue;

    const letter = nameToLetter[fullName];
    if (!letter) continue;

    profile[letter] = row.score;

    if (row.pro_has_id) {
      professions.push(row.pro_has_id);
    }
  }

  return {
    profile: profile as RiasecScores,
    professions,
  };
}
