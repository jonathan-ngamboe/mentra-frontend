import { getDictionary, SupportedLocale } from '../../../dictionaries';

export default async function Results({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);
  return (
    <div className="flex flex-col gap-4 items-center justify-center uppercase">
      <h3 className="text-2xl font-bold">
        {dict.pageUnderConstruction}</h3>
    </div>
  );
}
