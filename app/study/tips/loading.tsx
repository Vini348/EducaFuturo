import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-4 w-5/6 max-w-2xl mx-auto" />

        <div className="relative max-w-md mx-auto w-full">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-12 w-full mb-8 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-2 flex justify-between">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
      </div>

      <div className="mt-12">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-72 w-full rounded-md" />
      </div>

      <div className="mt-12">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
