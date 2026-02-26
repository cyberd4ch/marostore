import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
                <h1 className="text-6xl font-black tracking-tighter uppercase mb-6">Get in Touch</h1>
                <p className="text-slate-500 mb-12 text-lg">Have questions about a drop or an order? Our team is here to help.</p>
                
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-4 rounded-2xl"><Mail className="text-slate-900" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email Us</p>
                            <p className="font-bold">support@maro.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-4 rounded-2xl"><MapPin className="text-slate-900" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Visit Studio</p>
                            <p className="font-bold">Accra, Ghana</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <form className="space-y-6">
                    <input type="text" placeholder="Your Name" className="w-full bg-white border-none rounded-2xl p-4 shadow-sm" />
                    <input type="email" placeholder="Email Address" className="w-full bg-white border-none rounded-2xl p-4 shadow-sm" />
                    <textarea placeholder="How can we help?" rows={5} className="w-full bg-white border-none rounded-2xl p-4 shadow-sm resize-none" />
                    <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl tracking-widest uppercase hover:bg-black transition-colors">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}