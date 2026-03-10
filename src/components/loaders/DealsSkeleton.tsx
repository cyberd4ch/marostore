export default function DealsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
            <div className="flex justify-between items-center mb-8">
                <div className="h-8 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-[3/4] bg-slate-200 rounded-none" />
                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                        <div className="h-4 w-1/2 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}