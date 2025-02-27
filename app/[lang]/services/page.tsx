import { getDictionary, SupportedLocale } from "../dictionaries";
import { services } from "@/resources/config";
import FlowingMenu from "@/components/reactbits/Components/FlowingMenu/FlowingMenu";
import { getDictionaryValue } from "@/lib/utils";

export default async function Services({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  function getServiceItems() {
    return services.map((service) => ({
      text: getDictionaryValue(dict, service.labelKey) || service.labelKey,
      image: service.image,
      link: service.link,
    }));
  }

  return (
    <div className="relative w-full self-center">
      <FlowingMenu items={getServiceItems()} className="text-foreground" />
    </div>
  );
}
