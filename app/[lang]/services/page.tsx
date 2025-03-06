import { getDictionary, SupportedLocale } from '../dictionaries';
import { services } from '@/resources/config';
import WordScroller from '@/components/WordScroller';
import { getDictionaryValue } from '@/lib/utils';

export default async function Services({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  function getServiceItems() {
    return services.map((service) => ({
      text:
        getDictionaryValue(dict, service.labelKey).toLowerCase() || service.labelKey.toLowerCase(),
      link: service.link,
    }));
  }

  return (
    <div className="container mx-auto self-center">
      <div className="flex flex-col mx-auto">
        <header className="flex items-center justify-center text-center min-h-screen">
          <h1 className="text-5xl font-bold leading-tight">{dict.services.description}</h1>
        </header>

        <WordScroller prefix={dict.services.prefix} words={getServiceItems()} />

        <section className="flex items-center justify-center min-h-screen">
          <h2 className="text-5xl font-bold">{dict.services.end}.</h2>
        </section>
      </div>
    </div>
  );
}
