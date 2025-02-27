import { getDictionary, SupportedLocale } from "../dictionaries";
import { ErrorContent } from "./ErrorContent";

export default async function Error({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return <ErrorContent dictionary={dict} />;
}
