export default function TrendingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 rounded" />
                    <div className="h-4 w-64 bg-slate-100 rounded" />
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-10 bg-slate-100 rounded-full" />
                    <div className="h-10 w-10 bg-slate-100 rounded-full" />
                </div>
            </div>
            <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="min-w-[320px] space-y-4">
                        <div className="aspect-[4/5] bg-slate-200 rounded-2xl" />
                        <div className="h-5 w-2/3 bg-slate-200 rounded" />
                        <div className="h-6 w-1/3 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}