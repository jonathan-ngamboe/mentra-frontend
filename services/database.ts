'use server';

import { createClient } from '@/utils/supabase/server';

import {
  Profession,
  BaseProfession,
  RawProfessionDbData,
  QualificationLevel,
} from '@/types/profession';
import { RiasecScores, dimensionNameToKeyMap, riasecLetterToName } from '@/types/riasec';
import { Resource } from '@/types/resource';

type SupabaseRecord = Record<string, any>;

/**
  Function to fetch the language ID from its code.
  @param lang - The language code (ex: 'en', 'fr', etc.)
  @returns The corresponding language ID from the database.
*/
export async function fetchLanguageId(lang: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('language')
    .select('id')
    .eq('code', lang.toUpperCase())
    .single();

  if (error) {
    console.error('Language not found:', error);
    throw new Error(`Language not found: ${error.message}`);
  }

  return data.id;
}

/**
  Function to fetch translations from the database.
  @param table - The name of the table to fetch data from.
  @param field - The field to be translated.
  @param lang - The language code (default is 'en').
  @param idField - The field representing the ID (default is 'id').
  @param textField - The field representing the text (default is 'text').
  @param orderBy - The field to order the results by (default is 'index').
  @param orderDirection - The direction of ordering (default is 'asc').
  @param filter - Additional filters for the query.
  @param limit - Maximum number of results to return (optional).
*/
export async function fetchTranslation<T>({
  table,
  field,
  lang = 'en',
  idField = 'id',
  textField,
  orderBy = 'id',
  orderDirection = 'asc',
  filter = {},
  limit,
}: {
  table: string;
  field: string;
  lang?: string;
  idField?: string;
  textField: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filter?: Record<string, any>;
  limit?: number;
}): Promise<T[]> {
  const supabase = await createClient();

  // If the language is English, fetch directly from the main table
  if (lang === 'en') {
    const query = supabase.from(table).select(`${idField}, ${textField}`);

    if (orderBy) {
      query.order(orderBy, { ascending: orderDirection === 'asc' });
    }

    Object.entries(filter).forEach(([key, value]) => {
      query.eq(key, value);
    });

    if (limit) {
      query.limit(limit);
    }

    const { data: items, error: itemsError } = await query;

    if (itemsError) {
      console.error(`Error fetching ${table}:`, itemsError);
      throw new Error(`Error fetching ${table}: ${itemsError.message}`);
    }

    if (!items || items.length === 0) {
      return [] as T[];
    }

    return items.map((item) => {
      const record = item as SupabaseRecord;
      return record[textField] as T;
    });
  }

  // For other languages, fetch translations from the Translation table
  else {
    try {
      const langId = await fetchLanguageId(lang);

      // Map table names to column prefixes in the Translation table
      const tableToForeignKeyPrefix: Record<string, string> = {
        qualification_level: 'qu_le_has_id',
        riasec_dimension: 'ri_di_has_id',
        language: 'lan_translates_id',
        profession: 'pro_has_id',
        question: 'que_has_id',
        work_mode: 'wo_mo_has_id',
      };

      const foreignKeyField = tableToForeignKeyPrefix[table.toLowerCase()];

      if (!foreignKeyField) {
        throw new Error(`Unknown table: ${table}. Cannot determine foreign key field.`);
      }

      // First, get the ordered items from the main table with their IDs
      const query = supabase.from(table).select(`${idField}, ${orderBy}`);

      if (orderBy) {
        query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      Object.entries(filter).forEach(([key, value]) => {
        query.eq(key, value);
      });

      if (limit) {
        query.limit(limit);
      }

      const { data: orderedItems, error: itemsError } = await query;

      if (itemsError) {
        throw new Error(`Error fetching ${table}: ${itemsError.message}`);
      }

      if (!orderedItems || orderedItems.length === 0) {
        return [] as T[];
      }

      // Get the IDs in the correct order
      const orderedIds = orderedItems.map((item) => (item as SupabaseRecord)[idField]);

      // Fetch translations for these IDs
      const { data: translations, error: transError } = await supabase
        .from('translation')
        .select(`value, ${foreignKeyField}`)
        .eq('field', field)
        .eq('lan_translates_id', langId)
        .in(foreignKeyField, orderedIds);

      if (transError) {
        throw new Error(`Error fetching translations: ${transError.message}`);
      }

      if (!translations || translations.length === 0) {
        return [] as T[];
      }

      // Create a map of translations
      const translationMap = new Map();
      translations.forEach((trans) => {
        const record = trans as SupabaseRecord;
        translationMap.set(record[foreignKeyField], record.value);
      });

      // Return translations in the correct order
      const result: T[] = [];

      for (const id of orderedIds) {
        const translation = translationMap.get(id);
        if (translation) {
          result.push(translation as T);
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Error fetching translations: ${error}`);
    }
  }
}

/**
  Function to fetch questions from the database.
  @param lang - The language code (default is 'en').
  @param limit - Maximum number of questions to return (optional).
  @returns An array of questions.
*/
export async function fetchQuestions(lang: string = 'en', limit?: number): Promise<string[]> {
  return fetchTranslation<string>({
    table: 'question',
    field: 'text',
    lang,
    textField: 'text',
    orderBy: 'index',
    limit,
  });
}

/**
  Function to fetch RIASEC dimensions from the database.
  @param lang - The language code (default is 'en').
  @returns An array of RIASEC dimensions.
*/
export async function fetchDimensions(lang: string = 'en'): Promise<string[]> {
  return fetchTranslation<string>({
    table: 'riasec_dimension',
    field: 'name',
    lang,
    textField: 'name',
  });
}

/**
 * Function to fetch active professions along with their RIASEC evaluation object.
 * Handles translation for name, description, and activity_sector.
 * Returns data matching the Profession type (BaseProfession & { riasecEvaluation: RiasecScores }).
 * @param lang - The language code (default is 'en').
 * @param qualificationLevelId - Optional filter for qualification level.
 * @returns An array of active professions with their RIASEC evaluations.
 */
export async function fetchProfessions(
  lang: string = 'en',
  qualificationLevelId?: number
): Promise<Profession[]> {
  const supabase = await createClient();
  const isEnglish = lang.toLowerCase() === 'en';

  // --- 1. Update query string ---
  const queryStr = `
    id,
    name,
    option,
    description,
    activity_sector,
    min_duration,
    max_duration,
    effective_date,
    qualification_level ( id, short_name, long_name, description ),
    riasec_evaluation (
      score,
      riasec_dimension ( id, name )
    ),
    resource (
      name,
      href,
      resource_type ( typeName: name )
    )
  `;

  let query = supabase.from('profession').select(queryStr).eq('is_active', true);

  if (qualificationLevelId !== undefined) {
    query = query.eq('qu_le_is_level_o_id', qualificationLevelId);
  }

  // --- 2. Execute query ---
  const { data: rawProfessionsData, error: professionsError } = await query;

  if (professionsError) {
    throw new Error(`Error fetching professions: ${professionsError.message}`);
  }

  if (!rawProfessionsData || rawProfessionsData.length === 0) {
    return [];
  }

  // --- 3. Type assertion ---
  const rawProfessions = rawProfessionsData as unknown as RawProfessionDbData[];

  // --- 4. Retrieving translations for Professions AND Qualification Levels ---
  let professionTranslationsMap: {
    name: Map<number, string>;
    description: Map<number, string>;
    activitySector: Map<number, string>;
  } = { name: new Map(), description: new Map(), activitySector: new Map() };

  let qualLevelTranslationsMap: Map<
    number,
    { short_name?: string; long_name?: string; description?: string }
  > = new Map();

  if (!isEnglish) {
    try {
      const langId = await fetchLanguageId(lang);
      const professionIds = rawProfessions.map((p) => p.id);
      const qualLevelIds = Array.from(
        new Set(
          rawProfessions
            .map((p) => p.qualification_level?.id)
            .filter((id) => id !== undefined && id !== null)
        )
      ) as number[];

      // Fetch translations for Professions
      const professionFieldsToTranslate = ['name', 'description', 'activity_sector'];
      const { data: professionTranslations, error: proTransError } = await supabase
        .from('translation')
        .select('value, field, pro_has_id')
        .eq('lan_translates_id', langId)
        .in('pro_has_id', professionIds)
        .in('field', professionFieldsToTranslate);

      if (proTransError) throw proTransError;

      professionTranslations?.forEach((t) => {
        if (t.pro_has_id != null && t.value != null && t.field != null) {
          if (t.field === 'name') professionTranslationsMap.name.set(t.pro_has_id, t.value);
          else if (t.field === 'description')
            professionTranslationsMap.description.set(t.pro_has_id, t.value);
          else if (t.field === 'activity_sector')
            professionTranslationsMap.activitySector.set(t.pro_has_id, t.value);
        }
      });

      // Fetch translations for Qualification Levels
      if (qualLevelIds.length > 0) {
        const qualLevelFieldsToTranslate = ['short_name', 'long_name', 'description'];
        const { data: qualLevelTranslations, error: qualTransError } = await supabase
          .from('translation')
          .select('value, field, qu_le_has_id')
          .eq('lan_translates_id', langId)
          .in('qu_le_has_id', qualLevelIds)
          .in('field', qualLevelFieldsToTranslate);

        if (qualTransError) throw qualTransError;

        qualLevelTranslations?.forEach((t) => {
          if (t.qu_le_has_id != null && t.value != null && t.field != null) {
            if (!qualLevelTranslationsMap.has(t.qu_le_has_id)) {
              qualLevelTranslationsMap.set(t.qu_le_has_id, {});
            }
            const translations = qualLevelTranslationsMap.get(t.qu_le_has_id)!;
            if (t.field === 'short_name') translations.short_name = t.value;
            else if (t.field === 'long_name') translations.long_name = t.value;
            else if (t.field === 'description') translations.description = t.value;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching or processing translations:', error);
    }
  }

  // --- 5. Mapping Raw Data to Profession Type ---
  const professions = rawProfessions
    .map((rawProf): Profession | null => {
      if (rawProf.id == null) {
        console.warn('Skipping profession due to missing ID:', rawProf);
        return null;
      }

      // 5a. RIASEC treatment
      const riasecEvaluationObject: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      if (rawProf.riasec_evaluation) {
        rawProf.riasec_evaluation.forEach((ev) => {
          if (ev.riasec_dimension && ev.score != null) {
            ev.riasec_dimension.forEach((dim) => {
              const dimensionName = (dim as any)?.name;
              if (typeof dimensionName === 'string' && dimensionName.length > 0) {
                const potentialKey = dimensionNameToKeyMap[dimensionName];
                if (potentialKey && potentialKey in riasecEvaluationObject) {
                  riasecEvaluationObject[potentialKey] = ev.score ?? 0;
                } else {
                  console.warn(
                    `Unknown or invalid RIASEC dimension name mapping: ${dimensionName}`
                  );
                }
              } else if (dimensionName !== null) {
                console.warn(`Invalid or empty dimension name encountered: ${dimensionName}`);
              }
            });
          }
        });
      }

      // 5b. Application of profession-specific translations and default values
      const name =
        (isEnglish
          ? rawProf.name
          : professionTranslationsMap.name.get(rawProf.id) || rawProf.name) ??
        `Profession ${rawProf.id}`;
      const description = isEnglish
        ? rawProf.description
        : professionTranslationsMap.description.get(rawProf.id) || rawProf.description;
      const activitySector = isEnglish
        ? rawProf.activity_sector
        : professionTranslationsMap.activitySector.get(rawProf.id) || rawProf.activity_sector;

      // 5c. Apply translations to Qualification Level if not English and translation exists
      let translatedQualLevel: QualificationLevel | null = rawProf.qualification_level; // Start with the fetched data
      if (!isEnglish && rawProf.qualification_level) {
        const qualLevelId = rawProf.qualification_level.id;
        const translations = qualLevelTranslationsMap.get(qualLevelId);

        if (translations) {
          translatedQualLevel = {
            ...rawProf.qualification_level,
            short_name: translations.short_name ?? rawProf.qualification_level.short_name,
            long_name: translations.long_name ?? rawProf.qualification_level.long_name,
            description: translations.description ?? rawProf.qualification_level.description,
          };
        }
      }

      const baseProfessionData: BaseProfession = {
        id: rawProf.id,
        name: name,
        option: rawProf.option,
        description: description,
        activitySector: activitySector,
        minDuration: rawProf.min_duration,
        maxDuration: rawProf.max_duration,
        effectiveDate: rawProf.effective_date,
      };

      // --- 5d. Resource processing ---
      let processedResources: Resource[] = [];
      const rawResources = rawProf.resource;

      if (Array.isArray(rawResources)) {
        rawResources.forEach((rawRes) => {
          if (
            rawRes &&
            typeof rawRes === 'object' &&
            rawRes.name &&
            rawRes.href &&
            rawRes.resource_type &&
            typeof rawRes.resource_type === 'object' &&
            (rawRes.resource_type as any).typeName
          ) {
            processedResources.push({
              id: (rawRes as any).id,
              name: rawRes.name,
              href: rawRes.href,
              typeName: (rawRes.resource_type as any).typeName,
            });
          } else {
            console.warn(
              `Profession ID ${rawProf.id} has an incomplete or malformed resource item:`,
              rawRes
            );
          }
        });
      } else if (rawResources !== null) {
        console.warn(
          `Profession ID ${rawProf.id} has unexpected non-array resource data:`,
          rawResources
        );
      }
      const finalProfession: Profession = {
        ...baseProfessionData,
        qualificationLevel: translatedQualLevel,
        riasecScores: [riasecEvaluationObject],
        resources: processedResources,
      };

      return finalProfession;
    })
    .filter((p): p is Profession => p !== null); // --- 6. Filtering out null potentials ---

  return professions;
}

/**
 * Updates the RIASEC scores for a specific profession in the database.
 * It updates the 'score' field for each RIASEC dimension associated with the profession
 * in the 'Riasec_evaluation' table.
 *
 * @param professionId - The ID of the profession whose scores need to be updated.
 * @param newScores - An object containing the new scores for each RIASEC dimension (R, I, A, S, E, C).
 * @returns A promise that resolves with a success boolean and an error message if unsuccessful.
 */
export async function updateProfessionRiasecScores(
  professionId: number,
  newScores: RiasecScores
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  try {
    // 1. Fetch the mapping of RIASEC dimension names to their IDs from the database.
    // This is necessary to link the incoming letter scores (R, I, ...)
    // to the correct foreign keys (Ri_di_is_type_of_id) in the Riasec_evaluation table.
    const { data: dimensions, error: dimensionsError } = await supabase
      .from('riasec_dimension')
      .select('id, name');

    if (dimensionsError) {
      console.error(
        `[updateProfessionRiasecScores] Error fetching RIASEC dimensions:`,
        dimensionsError
      );
      return {
        success: false,
        error: `Failed to fetch RIASEC dimensions: ${dimensionsError.message}`,
      };
    }

    if (!dimensions || dimensions.length !== 6) {
      // Basic validation: expect exactly 6 dimensions
      console.error(
        `[updateProfessionRiasecScores] Unexpected number of RIASEC dimensions found (${dimensions?.length || 0}). Expected 6.`,
        dimensions
      );
      return {
        success: false,
        error: 'Could not retrieve all required RIASEC dimensions for mapping.',
      };
    }

      // Create a map for easy lookup of dimension ID by name (e.g., {'Realistic': 1, 'Investigative': 2, ...})
    const dimensionNameToIdMap = dimensions.reduce(
      (map, dim) => {
        if (dim.name && dim.id) {
          // Ensure name and id are not null/undefined
          map[dim.name] = dim.id;
        }
        return map;
      },
      {} as { [name: string]: number }
    );

    // Verify that we got IDs for all expected RIASEC names
    const expectedDimensionNames = Object.values(riasecLetterToName);
    const missingDimensions = expectedDimensionNames.filter(
      (name) => dimensionNameToIdMap[name] === undefined
    );
    if (missingDimensions.length > 0) {
      console.error(
        `[updateProfessionRiasecScores] Missing required RIASEC dimension IDs for names: ${missingDimensions.join(', ')}`
      );
      return {
        success: false,
        error: `Missing required RIASEC dimensions in DB: ${missingDimensions.join(', ')}`,
      };
    }

    // 2. Prepare and execute update promises for each RIASEC score.
    const updatePromises = Object.keys(newScores).map(async (letterKey) => {
      const letter = letterKey as keyof RiasecScores;
      const dimensionName = riasecLetterToName[letter];
      const dimensionId = dimensionNameToIdMap[dimensionName];
      const score = newScores[letter];

      // Skip update if score is missing or null
      if (score === undefined || score === null) {
        console.warn(
          `[updateProfessionRiasecScores] Score for dimension ${letter} is missing or null for profession ${professionId}. Skipping update for this dimension.`
        );
        return { dimension: letter, status: 'skipped' };
      }

      const { data, error } = await supabase
        .from('riasec_evaluation')
        .update({
          score: score,
          updated_at: new Date().toISOString(),
        })
        .match({
          pro_has_id: professionId,
          ri_di_is_type_of_id: dimensionId,
        });

      // Check for errors on this specific update
      if (error) {
        console.error(
          `[updateProfessionRiasecScores] Error updating score for dimension ${dimensionName} (${letter}) for profession ${professionId}:`,
          error
        );
        return { dimension: letter, status: 'failed', error: error.message };
      }

      // Check if no rows were matched/updated
      if (data === null) {
        console.warn(
          `[updateProfessionRiasecScores] No rows matched for dimension ${dimensionName} (${letter}) for profession ${professionId}. Could be missing data or RLS issue.`
        );
        return { dimension: letter, status: 'no_match' };
      }

      // If no error and data is not empty, the update was successful for this dimension
      return { dimension: letter, status: 'fulfilled' };
    });

    // 3. Wait for all update promises to settle.
    const updateResults = await Promise.allSettled(updatePromises);

    // 4. Summarize the results and report any failures or no-matches.
    const failedUpdates = updateResults.filter(
      (result) =>
        result.status === 'rejected' ||
        (result.status === 'fulfilled' && result.value?.status === 'failed')
    );

    const skippedUpdates = updateResults.filter(
      (result) => result.status === 'fulfilled' && result.value?.status === 'skipped'
    );

    // Filter results where no rows were matched
    const noMatchUpdates = updateResults.filter(
      (result) => result.status === 'fulfilled' && result.value?.status === 'no_match'
    );

    if (failedUpdates.length > 0) {
      const errors = failedUpdates
        .map((result) => {
          if (result.status === 'rejected') {
            return `Promise Rejected: ${result.reason}`;
          } else {
            return `Dimension ${result.value.dimension}: ${result.value.error}`;
          }
        })
        .join('; ');
      return { success: false, error: `Database errors: ${errors}` };
    }

    // Report if any dimension update found no matching row
    if (noMatchUpdates.length > 0) {
      const dimensionsWithNoMatch = noMatchUpdates
        .map(
          (result) =>
            (result as PromiseFulfilledResult<{ dimension: keyof RiasecScores; status: string }>)
              .value.dimension
        )
        .join(', ');
      const totalExpectedUpdates = Object.keys(newScores).length - skippedUpdates.length;
      const successfullyFulfilledUpdates = updateResults.filter(
        (result) => result.status === 'fulfilled' && result.value?.status === 'fulfilled'
      ).length;

      let errorMessage = `Update completed, but no matching record found for dimensions: ${dimensionsWithNoMatch}. This could be due to missing data in 'riasec_evaluation' or RLS policies preventing access.`;

      if (successfullyFulfilledUpdates > 0) {
        // Partial success case: Some dimensions updated, others didn't match
        errorMessage = `Partial update: Records updated for ${successfullyFulfilledUpdates}/${totalExpectedUpdates} dimensions. No matching record found for dimensions: ${dimensionsWithNoMatch}. (Check data or RLS).`;
        return { success: false, error: errorMessage };
      } else {
        // No dimensions were successfully updated because none matched
        return {
          success: false,
          error: `Update failed: No matching record found for any of the dimensions (${dimensionsWithNoMatch}). (Check data or RLS).`,
        };
      }
    }

    // If no failed updates and no no-match updates, then all relevant updates were fulfilled or skipped
    if (skippedUpdates.length > 0) {
      console.warn(
        `[updateProfessionRiasecScores] Skipped updates for ${skippedUpdates.length} dimensions due to missing/null scores for profession ${professionId}.`
      );
      // If everything was skipped, maybe success: false is better? Depends on context.
      // Assuming skipped means no score was provided, not a failure to apply.
    }

    // Full success: all relevant updates found a match and succeeded
    return { success: true, error: null };
  } catch (generalError: any) {
    console.error(
      `[updateProfessionRiasecScores] An unexpected error occurred during RIASEC update for profession ${professionId}:`,
      generalError
    );
    return { success: false, error: `An unexpected error occurred: ${generalError.message}` };
  }
}
