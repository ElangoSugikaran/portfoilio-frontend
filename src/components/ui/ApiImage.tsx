import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ApiImageProps {
  src: string
  fallbackSrc?: string
  loading?: boolean
  className?: string
}

export function ApiImage({ src, fallbackSrc, loading = false, className }: ApiImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)
  const isShowingSkeleton = !isLoaded || loading

  useEffect(() => {
    setImageSrc(src)
    setIsLoaded(false)
    setHasFailed(false)
  }, [src])

  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setIsLoaded(false)
      return
    }

    setHasFailed(true)
    setIsLoaded(true)
  }

  return (
    <span
      role={isShowingSkeleton ? 'status' : undefined}
      aria-label={isShowingSkeleton ? 'Loading logo image' : undefined}
      aria-busy={isShowingSkeleton}
      className={cn('relative block h-full w-full overflow-hidden rounded-full', className)}
    >
      {isShowingSkeleton && (
        <Skeleton
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-muted-foreground/20"
        />
      )}
      {!hasFailed && (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full rounded-full object-cover transition-opacity duration-200',
            isLoaded && !loading ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />
      )}
    </span>
  )
}
