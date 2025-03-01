import { OtpLogin } from '@/components/OtpLogin';
import { getDictionary, SupportedLocale } from '../../dictionaries';
import { Clock } from 'lucide-react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BorderBeam } from '@/components/magicui/border-beam';

export default async function CareerMatching({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-24 md:py-0 self-center">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {/* Header Section */}
        <section className="space-y-8">
          <div className="space-y-4">
            <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">
              {dict.services.title}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight uppercase">
              {dict.services.careerMatching.title}
            </h1>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock size={16} className="flex-shrink-0" />
              <span className="font-medium">{dict.services.careerMatching.duration}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-left">
            <h2 className="text-xl md:text-2xl font-bold">
              {dict.services.careerMatching.subtitle}
            </h2>

            <p className="text-base md:text-lg max-w-2xl">
              {dict.services.careerMatching.description}
            </p>
          </div>
        </section>

        {/* CTA Section with Visible Wow Effect */}
        <section className="relative mt-4">
          {/* Card with border glow */}
          <div className="relative border border-gray-200 dark:border-gray-800 rounded-xl shadow-elevated p-8 md:p-10 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="text-left space-y-4 max-w-sm">
                <h2 className="text-xl md:text-2xl font-bold">
                  <AuroraText>{dict.services.careerMatching.cta.toUpperCase()}</AuroraText>
                </h2>

                <p className="text-gray-700 dark:text-gray-300">{dict.login.otp.description}</p>
              </div>

              <div className="w-full md:w-auto">
                <OtpLogin dictionary={dict} onSuccessRedirect="/services/career-matching/test" />
              </div>
            </div>
            <BorderBeam
              duration={12}
              size={200}
              className="from-transparent via-red-500 to-transparent"
            />
            <BorderBeam
              duration={12}
              delay={6}
              size={200}
              className="from-transparent via-blue-500 to-transparent"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
