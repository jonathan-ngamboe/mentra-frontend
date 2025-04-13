"use client";

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-destructive/10 text-destructive rounded-md">
      <div className="flex max-w-md flex-col items-center gap-4 p-6 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Oops!</h2>
          <p className="text-muted-foreground">{error.message || 'Something went wrong.'}</p>
          {error.stack && process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-100 p-2 text-left text-xs">
              {error.stack}
            </pre>
          )}
        </div>
        <Button onClick={() => reset()} className="mt-4 cursor-pointer">
          Try again
        </Button>
      </div>
    </div>
  );
}
