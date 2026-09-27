const SkeletonCard = () => (
  <div className="bg-slate-800 rounded-xl p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 w-28 rounded-full bg-slate-700" />
      <div className="h-5 w-12 rounded-full bg-slate-700" />
    </div>
    <div className="space-y-3 my-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-700" />
        <div className="h-4 flex-1 rounded bg-slate-700" />
        <div className="h-4 w-8 rounded bg-slate-700" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-700" />
        <div className="h-4 flex-1 rounded bg-slate-700" />
        <div className="h-4 w-8 rounded bg-slate-700" />
      </div>
    </div>
    <div className="h-3 w-36 rounded bg-slate-700 mt-3" />
  </div>
)

const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default LoadingState
