export function SkeletonLoader() {   // tailwind skeleton loader for dashboard
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <div className="flex-1 p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-50 rounded animate-pulse" />
                <div className="h-3 w-[80%] bg-slate-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="h-[400px] bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-4 h-4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 flex-1 bg-slate-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-slate-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
