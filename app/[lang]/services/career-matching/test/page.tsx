import { getDictionary, SupportedLocale } from '../../../dictionaries';
import { QuizContent } from '@/components/QuizContent';
import { InfoPanel } from '@/components/InfoPanel';
import { UserInfoForm } from '@/components/UserInfoForm';

export default async function Services({ params }: { params: Promise<{ lang: SupportedLocale }> }) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <div className="relative flex flex-col gap-8 w-full h-full justify-center items-center pointer-events-none">
      <InfoPanel dictionary={dict} />
      <UserInfoForm dictionary={dict} />
      <QuizContent />
    </div>
  );
}
