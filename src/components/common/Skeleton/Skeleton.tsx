type SkeletonProps = {
  className?: string;
};

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={[
        "animate-pulse bg-gray-200/80 dark:bg-gray-700/40 rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export default Skeleton;
