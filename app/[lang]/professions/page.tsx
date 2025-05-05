import { getDictionary, SupportedLocale } from '../dictionaries';
import { ProfessionTable } from '@/components/ProfessionTable';
import { fetchProfessions } from '@/services/database';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function ProfessionsPage({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const professions = await fetchProfessions(lang);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl content-center">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          {dictionary.professionsPage.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {dictionary.professionsPage.subtitle}
        </p>
      </div>

      <Alert className="mb-8 bg-card shadow-sm">
        <Terminal className="h-4 w-4" /> 
        <AlertTitle>{dictionary.professionsPage.instructionsTitle}</AlertTitle>
        <AlertDescription>{dictionary.professionsPage.instructionsText}</AlertDescription>
      </Alert>

      <ProfessionTable professions={professions} dictionary={dictionary} lang={lang} />
    </div>
  );
}
