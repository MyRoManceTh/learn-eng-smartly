import { Skeleton } from "@/components/ui/skeleton";

const LessonSkeleton = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Generate button skeleton */}
      <Skeleton className="w-full h-12 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Article skeleton */}
        <div className="lg:col-span-3 rounded-lg border border-border bg-card p-4 sm:p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          {/* Image */}
          <Skeleton className="w-full h-40 sm:h-48 rounded-lg" />
          {/* Text lines */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                {Array.from({ length: 4 + (i % 3) }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-4" style={{ width: `${40 + Math.random() * 50}px` }} />
                    <Skeleton className="h-3" style={{ width: `${30 + Math.random() * 30}px` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Translation */}
          <div className="border-t border-border pt-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* Vocab skeleton */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-3 sm:p-4 space-y-3">
          <Skeleton className="h-5 w-20 mb-3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-background p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz button skeleton */}
      <div className="text-center">
        <Skeleton className="h-11 w-full max-w-xs mx-auto rounded-lg" />
      </div>
    </div>
  );
};

export default LessonSkeleton;
