export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 sm:h-52 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-3 sm:p-4">
        {/* Title lines */}
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3" />

        {/* Badge skeleton */}
        <div className="h-5 bg-gray-100 rounded-md w-16" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
