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
      badge: getDictionaryValue(dict, service.badge || '') || service.badge,
    }));
  }

  return (
    <WordScroller
      title={dict.services.title}
      description={dict.services.description}
      action={dict.services.action}
      prefix={dict.services.prefix}
      words={getServiceItems()}
      endWord={dict.services.end}
    />
  );
}
