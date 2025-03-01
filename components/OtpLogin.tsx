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
import { createEmailFormSchema, createOtpFormSchema } from '@/lib/validations/auth';
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
    resolver: zodResolver(createOtpFormSchema(dictionary)),
    defaultValues: {
      pin: '',
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailFormSchema(dictionary)),
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

  const sendOtp = async (email: string) => {
    try {
      await signinByOtp(email);
      setIsSubmitted(true);
      setIsResendEnabled(false);
      reset();
      toast.success(dictionary.login.otp.sentDescription);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('rate limit')) {
        toast.error(dictionary.error.rateLimitExceeded);
      } else {
        toast.error(dictionary.error.default);
        console.error('Login error:', error);
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await emailForm.trigger();
    if (!result) {
      return;
    }

    setIsSubmitting(true);

    const formValues = emailForm.getValues();
    const validatedEmail = formValues.email;

    try {
      await sendOtp(validatedEmail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isSubmitting) return;
    try {
      await sendOtp(email);
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('expired')) {
        toast.error(dictionary.error.otp_expired);
      } else {
        toast.error(dictionary.login.otp.invalidCode);
      }
      console.error('Login error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDidntReceiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRetry(true);
  };

  const showRetryLabel = () => {
    if (!isResendEnabled) {
      return dictionary.login.resendWait.replace('{seconds}', countdown.toString());
    }

    if (isSubmitting) {
      return (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {dictionary.login.submitting || 'Submitting...'}
        </span>
      );
    }
    return dictionary.login.resendEmail;
  };

  const showRetryButton = () => {
    if (showRetry) {
      return (
        <Button
          onClick={handleResend}
          disabled={!isResendEnabled || isSubmitting || isVerifying}
          className="cursor-pointer w-full"
          variant="outline"
        >
          {showRetryLabel()}
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
