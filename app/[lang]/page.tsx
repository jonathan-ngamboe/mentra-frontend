import { getDictionary, SupportedLocale } from './dictionaries';
import { siteName } from '@/resources/config';
import { AuroraText } from '@/components/magicui/aurora-text';
import { HomeButton } from '@/components/HomeButton';

export default async function Home({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-center text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
        {dictionary.home.headline} <AuroraText>{siteName.toLowerCase()}</AuroraText>
      </h1>
      <span className="text-center text-lg font-medium">{dictionary.home.subline}</span>
      <HomeButton cta={dictionary.home.cta} link="/services/career-matching" />
    </div>
  );
}
