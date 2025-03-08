import { getDictionary, SupportedLocale } from '../dictionaries';
import { services } from '@/resources/config';
import { getDictionaryValue } from '@/lib/utils';
import ServicesContent from '@/components/ServicesContent';

export default async function Services({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  const serviceItems = services.map((service) => {
    const translatedLabel = getDictionaryValue(dict, service.labelKey);
    const translatedBadge = service.badge ? getDictionaryValue(dict, service.badge) : undefined;

    return {
      ...service,
      text: translatedLabel,
      badge: translatedBadge,
    };
  });

  return <ServicesContent dictionary={dict} serviceItems={serviceItems} />;
}
