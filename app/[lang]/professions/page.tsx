import { getDictionary, SupportedLocale } from '../dictionaries';
import { ProfessionTable } from '@/components/ProfessionTable';
import { fetchProfessions } from '@/services/database';

export default async function Professions({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const professions = await fetchProfessions(lang);

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-10 py-12 md:py-16 w-full content-center">
      <h1 className="text-5xl font-bold text-center">{dictionary.professionsPage.title}</h1>
      <p className="text-xl text-center text-gray-500 dark:text-gray-400">
        {dictionary.professionsPage.subtitle}
      </p>
      <ProfessionTable professions={professions} dictionary={dictionary} lang={lang} />
    </div>
  );
}
