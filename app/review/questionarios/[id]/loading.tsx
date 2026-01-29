import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionarioDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-md mb-6" />
      </div>

      <div className="space-y-8">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-6 shadow-sm">
              <Skeleton className="h-6 w-full max-w-2xl mb-4" />

              <div className="space-y-3 mt-4">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-full max-w-xl" />
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
