import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface RichTextProps {
  html?: string | null;
  className?: string;
}

export const RichText = ({ html, className }: RichTextProps) => {
  if (!html) return null;

  // Sanitize the HTML string to protect against XSS vulnerabilities
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'b',
      'i',
      'em',
      'strong',
      'a',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'span',
      'br',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'title'],
  });

  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-p:leading-relaxed prose-p:text-muted-foreground',
        'prose-headings:text-foreground prose-headings:font-bold',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-a:text-primary hover:prose-a:underline prose-a:underline-offset-4',
        'prose-li:text-muted-foreground prose-li:my-1',
        'prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
