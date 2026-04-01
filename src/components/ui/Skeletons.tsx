import React from "react";

export function StoryCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-crimson/5 overflow-hidden shadow-sm animate-pulse flex flex-col h-[400px]">
      <div className="w-full h-48 bg-slate-200"></div>
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded-md w-full"></div>
            <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function BlogRowSkeleton() {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-3xl border border-crimson/5 overflow-hidden shadow-sm animate-pulse h-auto md:h-56">
      <div className="w-full md:w-1/3 h-48 md:h-full bg-slate-200 shrink-0"></div>
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-4">
        <div className="h-4 bg-slate-200 rounded-md w-24"></div>
        <div className="h-8 bg-slate-200 rounded-md w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
        </div>
        <div className="h-4 bg-slate-200 rounded-md w-32 mt-4"></div>
      </div>
    </div>
  );
}
