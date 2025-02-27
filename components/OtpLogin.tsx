'use client';

import { useState } from 'react';
import { useTransitionNavigation } from '@/components/transitions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdown } from '@/hooks/useCountdown';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import { signinByOtp, verifyOtp } from '@/services';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { EmailFormSchema, OtpFormSchema } from '@/lib/validations/auth';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import type { OtpLoginProps, OtpFormValues, EmailFormValues } from '@/types/login';

export function OtpLogin({ dictionary, onSuccessRedirect }: OtpLoginProps) {
  const { navigateWithTransition } = useTransitionNavigation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const { countdown, reset } = useCountdown({
    initialCount: 60,
    start: isSubmitted,
    onComplete: () => setIsResendEnabled(true),
  });

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await emailForm.trigger();
    if (!result) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formValues = emailForm.getValues();
      const validatedEmail = formValues.email;

      await signinByOtp(validatedEmail);
      setIsSubmitted(true);
      toast.success(dictionary.login.otp.sentDescription);
    } catch (error) {
      toast.error(dictionary.error.default);
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await signinByOtp(email);
      setIsResendEnabled(false);
      reset();
      toast.success(dictionary.login.otp.sentDescription);
    } catch (error) {
      toast.error(dictionary.error.default);
      console.error('Login error:', error);
    } finally {
      setShowRetry(false);
    }
  };

  const onSubmit = async (data: OtpFormValues) => {
    setIsVerifying(true);
    try {
      await verifyOtp(data.pin, email);
      toast.success(dictionary.login.otp.successMessage);
      if (onSuccessRedirect) {
        navigateWithTransition(onSuccessRedirect);
      }
    } catch (error) {
      toast.error(dictionary.login.otp.invalidCode);
      console.error('Login error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDidntReceiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRetry(true);
  };

  const showRetryButton = () => {
    if (showRetry) {
      return (
        <Button
          onClick={handleResend}
          disabled={!isResendEnabled}
          className="cursor-pointer w-full"
          variant="outline"
        >
          {isResendEnabled
            ? dictionary.login.resendEmail
            : dictionary.login.resendWait.replace('{seconds}', countdown.toString())}
        </Button>
      );
    }
    return (
      <Button onClick={handleDidntReceiveClick} variant="ghost" className="cursor-pointer w-full">
        {dictionary.login.otp.notReceived}
      </Button>
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onSubmit)} className="w-2/3 space-y-6 w-full">
            <div className="flex flex-col gap-8">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center gap-8">
                  <p>{dictionary.login.otp.enterCode}</p>
                  <FormField
                    control={otpForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem className="place-items-center">
                        <FormControl>
                          <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription className="text-center">
                          {dictionary.login.checkSpamFirst}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isVerifying} className="w-full cursor-pointer">
                    {isVerifying ? dictionary.login.otp.verifying : dictionary.login.otp.verify}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
        {showRetryButton()}
      </div>
    );
  }

  return (
    <LoginForm
      dictionary={dictionary}
      email={email}
      setEmail={setEmail}
      submit={handleEmailSubmit}
      cta={dictionary.login.otp.cta}
      form={emailForm}
      isSubmitting={isSubmitting}
    />
  );
}
