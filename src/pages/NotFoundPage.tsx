import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div data-ambient="about" className="min-h-dvh flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full bg-card border border-border/60 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-6">
        <span className="text-7xl font-black text-primary font-mono tracking-tighter">404</span>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Page Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button asChild className="flex-1 rounded-xl gap-2 bg-primary text-primary-foreground font-bold">
            <Link to="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
