const LiveBadge = () => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      LIVE
    </span>
  )
}

export default LiveBadge
