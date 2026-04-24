import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 5, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b bg-muted/20">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 rounded-md" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 p-4 border-b border-border/30">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          {Array.from({ length: columns - 1 }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}
