import React from 'react';
import { AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QueryStateProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data?: T | null;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  children: React.ReactNode | ((data: T) => React.ReactNode);
}

export function QueryState<T>({
  isLoading,
  isError,
  error,
  data,
  isEmpty,
  onRetry,
  loadingComponent,
  emptyTitle = 'No data available',
  emptyMessage = 'There are no items to display at this moment.',
  emptyAction,
  className,
  children,
}: QueryStateProps<T>) {
  // 1. Loading State
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn('w-full py-16 flex flex-col items-center justify-center gap-4', className)}
      >
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
          Loading content...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    const errorMsg =
      (error as { message?: string })?.message ||
      'Unable to connect to the server. Please check your connection.';

    return (
      <div
        role="alert"
        className={cn(
          'w-full py-12 px-6 rounded-3xl bg-destructive/5 border border-destructive/20 text-center flex flex-col items-center justify-center gap-4 my-4',
          className
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="text-base font-bold text-foreground">Failed to load content</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{errorMsg}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 rounded-xl text-xs gap-2 border-border/80 hover:bg-muted"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // 3. Empty State Check
  const isDataEmpty =
    data === undefined ||
    data === null ||
    (Array.isArray(data) && data.length === 0) ||
    (isEmpty ? isEmpty(data as T) : false);

  if (isDataEmpty) {
    return (
      <div
        className={cn(
          'w-full py-16 px-6 rounded-3xl bg-muted/10 border border-border/40 text-center flex flex-col items-center justify-center gap-4',
          className
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-muted/40 text-muted-foreground flex items-center justify-center">
          <FolderSearch className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="text-base font-bold text-foreground">{emptyTitle}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{emptyMessage}</p>
        </div>
        {emptyAction && <div className="mt-2">{emptyAction}</div>}
      </div>
    );
  }

  // 4. Render Data
  if (typeof children === 'function') {
    return <>{children(data as T)}</>;
  }

  return <>{children}</>;
}
