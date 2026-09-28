import React from "react";

export function VendorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse flex flex-col justify-between h-56"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800" />
                <div>
                  <div className="h-5 w-28 bg-slate-800 rounded mb-2" />
                  <div className="h-3 w-20 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-slate-800 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="h-14 bg-slate-900 rounded-xl" />
              <div className="h-14 bg-slate-900 rounded-xl" />
            </div>
          </div>
          <div className="h-10 bg-slate-800 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
}

export function BriefSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top bar skeleton */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-800 rounded mb-2" />
          <div className="h-4 w-64 bg-slate-800/60 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-slate-800 rounded-xl" />
          <div className="h-10 w-36 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Memory panel skeleton */}
      <div className="glass-card rounded-2xl p-8 border border-indigo-500/20 bg-slate-900/60">
        <div className="h-6 w-56 bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-20 bg-slate-800/80 rounded-xl" />
          <div className="h-20 bg-slate-800/80 rounded-xl" />
          <div className="h-20 bg-slate-800/80 rounded-xl" />
        </div>
        <div className="h-24 bg-slate-800/50 rounded-xl" />
      </div>

      {/* Grid of cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-6 border border-slate-800 min-h-[180px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
              <div className="h-5 w-36 bg-slate-800 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800/60 rounded" />
              <div className="h-4 w-3/4 bg-slate-800/60 rounded" />
              <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
