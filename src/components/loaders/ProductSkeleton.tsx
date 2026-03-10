export default function ProductSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* Left: Image Skeleton */}
                <div className="aspect-[4/5] bg-slate-200 rounded-2xl w-full" />

                {/* Right: Info Skeleton */}
                <div className="flex flex-col w-full space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                        <div className="h-10 w-3/4 bg-slate-200 rounded" />
                        <div className="h-6 w-32 bg-slate-200 rounded" />
                    </div>
                    
                    <div className="h-24 w-full bg-slate-100 rounded-xl" />
                    
                    <div className="flex gap-4">
                        <div className="h-14 flex-1 bg-slate-200 rounded-lg" />
                        <div className="h-14 w-14 bg-slate-200 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}