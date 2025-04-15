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
 * Save the RIASEC results of a user
 */
export async function saveUserRiasecResults(userId: string, profile: RiasecScores): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const RIASEC_DIMENSION_IDS = await getRiasecDimensionIds();

  if (!RIASEC_DIMENSION_IDS) {
    throw new Error('Riasec Dimension IDs not found');
  }

  // Delete previous results for the user, if any
  const { error: deleteError } = await supabase
    .from('riasec_evaluation')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    throw new Error(`Error deleting old RIASEC results - ${deleteError.message}`);
  }

  // Prepare new results to insert
  const records = Object.entries(profile).map(([dim, score]) => ({
    user_id: userId,
    ri_di_is_type_of_id: RIASEC_DIMENSION_IDS[dim as keyof RiasecScores],
    score,
    created_at: now,
    updated_at: now,
    pro_has_id: null,
  }));

  console.log('Saving records', records);

  // Insert new results
  const { error: insertError } = await supabase.from('riasec_evaluation').insert(records);

  if (insertError) {
    throw new Error(`Error saving user RIASEC results - ${insertError.message}`);
  }
}

/**
 * Get the RIASEC profile of a user
 */
export async function getUserRiasecProfile(userId: string): Promise<
  Array<{
    id: number;
    profile: RiasecScores;
    topProfessions: ProfessionMatch[];
    createdAt: string;
  }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('riasec_evaluation')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching user RIASEC history - ${error.message}`);
  }

  return data.map((result) => ({
    id: result.id,
    profile: result.profile,
    topProfessions: result.top_professions,
    createdAt: result.created_at,
  }));
}
