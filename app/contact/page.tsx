import Navbar from "../components/Navbar";

import ContactForm from "../components/ContactForm";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b728020_1px,transparent_1px),linear-gradient(to_bottom,#6b728020_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Get in <span className="text-blue-500">Touch</span>
                        </h1>
                        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Have questions about clipping or partnerships? Drop us a message and we'll get back to you as soon as possible.
                        </p>

                        <div className="flex flex-col gap-4 text-gray-400 text-sm sm:text-base items-center lg:items-start">
                            {/* Email removed as per request */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <svg suppressHydrationWarning className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span>Response time: Within 24 hours</span>
                            </div>
                        </div>
                    </div>

                    <ContactForm />
                </div>
            </section>

            {/* Footer removed to avoid duplication with layout */}
        </main>
    );
}
