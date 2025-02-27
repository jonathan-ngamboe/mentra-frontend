"use client";

import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dictionary } from "@/types/dictionary";
import { toast } from "sonner";
import { Button } from "./ui/button";

type RetryLoginProps = {
  dictionary: Dictionary;
  email: string;
  login: (email: string) => void;
  emailSentDescription: string;
  start: boolean;
};
export function RetryLogin({
  dictionary,
  email,
  login,
  emailSentDescription,
  start,
}: RetryLoginProps) {
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { countdown, reset } = useCountdown({
    initialCount: 60,
    start,
    onComplete: () => setIsResendEnabled(true),
  });

  const handleResend = async () => {
    try {
      login(email);
      setIsResendEnabled(false);
      reset();
    } catch (error) {
      toast.error(`${dictionary.error.default}: ${error}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <Alert>
        <AlertTitle>{dictionary.login.checkEmail}</AlertTitle>
        <AlertDescription>{emailSentDescription}</AlertDescription>
        <AlertDescription>
          <Button onClick={handleResend} disabled={!isResendEnabled}>
            {isResendEnabled
              ? dictionary.login.resendEmail
              : dictionary.login.resendWait.replace(
                  "{seconds}",
                  countdown.toString()
                )}
          </Button>
        </AlertDescription>
      </Alert>
      <p className="text-base text-center">{dictionary.login.checkSpamFirst}</p>
    </div>
  );
}
