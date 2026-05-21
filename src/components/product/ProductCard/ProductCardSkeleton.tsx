import Skeleton from "../../common/Skeleton/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="pb-[40px]">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-1.5 px-[40px] pt-[30px]">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
