import { getDictionary, SupportedLocale } from "../dictionaries";

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <section className="w-full flex flex-col items-center justify-center pb-40">
      <p className="mb-4 text-4xl font-bold">404</p>
      <h1 className="mb-8 text-2xl font-medium">{dict.notFound.title}</h1>
      <p className="text-gray-600">{dict.notFound.description}</p>
    </section>
  );
}
