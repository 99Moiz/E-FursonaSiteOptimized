import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
}

interface MediaSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  isLoaded: boolean;
  children: ReactNode;
}

function MediaSkeleton({ className, isLoaded, children, ...props }: MediaSkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      )}
      <div className={cn("h-full w-full transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0")}>{children}</div>
    </div>
  );
}

export { Skeleton, MediaSkeleton };
