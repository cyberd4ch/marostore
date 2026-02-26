export default function PrivacyPage({ title = "Privacy Policy" }) {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">{title}</h1>
            <div className="space-y-12 text-slate-600">
                <section>
                    <h2 className="text-slate-900 font-bold uppercase mb-4">1. Overview</h2>
                    <p>Standard privacy policy details go here. Update this with your specific business rules.</p>
                </section>
                <section>
                    <h2 className="text-slate-900 font-bold uppercase mb-4">2. Conditions</h2>
                    <p>More details about how Maro handles {title.toLowerCase()}.</p>
                </section>
            </div>
        </div>
    );
}