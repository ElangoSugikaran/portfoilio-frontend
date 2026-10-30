import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ErrorFallback = () => {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred while rendering this page.';
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border/60 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-destructive">
            Error {statusCode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>
          <Button asChild className="flex-1 rounded-xl gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
