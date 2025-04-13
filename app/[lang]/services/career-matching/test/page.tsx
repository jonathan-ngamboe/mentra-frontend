import TestContent from './TestContent';
import { getDictionary, SupportedLocale } from '../../../dictionaries';

export default async function Test({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <div className="relative flex flex-col p-8 w-full h-full justify-center items-center">
      <TestContent dict={dict} lang={lang} />
    </div>
  );
}
