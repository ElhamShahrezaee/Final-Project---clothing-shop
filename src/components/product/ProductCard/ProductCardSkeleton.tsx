import Skeleton from "../../common/Skeleton/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="h-[380px] w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

