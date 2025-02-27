import { getDictionary, SupportedLocale } from "../dictionaries";
import { OtpLogin } from "@/components/OtpLogin";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}) {
  const lang = (await params).lang;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex justify-center px-12 transform translate-y-1 transition-all w-full">
      <div className="max-w-sm w-full flex flex-col items-center justify-center gap-8 login-form-wrapper">
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-2xl font-bold text-center text-balance">
            {dictionary.login.welcome}
          </h1>
          <p className="text-sm text-center text-gray-600">
            {dictionary.login.otp.description}
          </p>
        </div>
        <OtpLogin dictionary={dictionary} />
      </div>
    </div>
  );
}
