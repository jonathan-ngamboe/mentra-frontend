"use client";

import { Dictionary } from "@/types/dictionary";
import { useSearchParams } from "next/navigation";
import { useTransitionNavigation } from "@/components/transitions";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type ErrorContentProps = {
  dictionary: Dictionary;
};

export function ErrorContent({ dictionary }: ErrorContentProps) {
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useTransitionNavigation();

  const errorCode = searchParams.get("error_code");
  const errorType = searchParams.get("error");

  const getErrorMessage = () => {
    const errorKey = errorCode || errorType || "default";

    return {
      title:
        dictionary.error[errorKey as keyof typeof dictionary.error] ||
        dictionary.error.default,
      description:
        dictionary.error[
          `${errorKey}_description` as keyof typeof dictionary.error
        ] || "",
    };
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="flex flex-col items-center justify-center">
      <Alert variant="destructive">
        <AlertTitle>{errorMessage.title}</AlertTitle>
        <AlertDescription>{errorMessage.description}</AlertDescription>
        <Button variant="ghost" size="lg" onClick={() => navigateWithTransition(`/`)}>
          <House />
          {dictionary.home.backHome}
        </Button>
      </Alert>
    </div>
  );
}
