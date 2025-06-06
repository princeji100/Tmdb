export const MovieSkeleton = () => {
  return (
    <div className="bg-zinc-900/50 rounded-lg sm:rounded-xl overflow-hidden">
      <div className="aspect-[2/3] bg-zinc-800/50 animate-pulse" />
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
        <div className="h-4 sm:h-5 bg-zinc-800/50 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-3 sm:h-4 w-14 sm:w-16 bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-3 sm:h-4 w-14 sm:w-16 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-2 sm:h-3 w-10 sm:w-12 bg-zinc-800/50 rounded-full animate-pulse" />
          <div className="h-2 sm:h-3 w-10 sm:w-12 bg-zinc-800/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};