'use server';

import { createClient } from '@/utils/supabase/server';

type SupabaseRecord = Record<string, any>;

/*
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

/*
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

/*
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

/*
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

/*
  Function to fetch professions from the database.
  @param lang - The language code (default is 'en').
  @param qualificationLevelId - Optional filter for qualification level.
  @returns An array of professions.
*/
export async function fetchProfessions(
  lang: string = 'en',
  qualificationLevelId?: number
): Promise<string[]> {
  const filter = qualificationLevelId ? { qu_le_is_level_o_id: qualificationLevelId } : {};

  return fetchTranslation<string>({
    table: 'profession',
    field: 'masculine_name',
    lang,
    textField: 'masculine_name',
    filter,
  });
}
