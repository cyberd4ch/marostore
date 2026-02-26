export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-8">Our Story</h1>
            <div className="h-1.5 w-20 bg-slate-900 rounded-full mb-12" />
            
            <div className="prose prose-slate prose-xl font-medium text-slate-600 space-y-8">
                <p>
                    Maro was born out of a desire for curated, high-quality essentials. 
                    We believe that the items you wear should tell a story of craftsmanship and intentionality.
                </p>
                <p>
                    Based in Ghana, we source and curate pieces that blend contemporary 
                    aesthetics with timeless quality. Every "Deposit to Inventory" is 
                    vetted by our team to ensure it meets the Maro standard.
                </p>
            </div>
        </div>
    );
}