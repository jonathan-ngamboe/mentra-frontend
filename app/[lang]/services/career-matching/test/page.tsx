import { TestContent } from "./TestContent";
import { getDictionary, SupportedLocale } from "../../../dictionaries";

export default async function Services({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return <TestContent dictionary={dict} />;
}
