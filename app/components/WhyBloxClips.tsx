import { Globe, Network, Activity, CheckCircle2, BarChart3, Timer } from "lucide-react";

const reasons = [
    {
        icon: Globe,
        title: "Beyond Traditional Sponsors",
        description: "Roblox sponsors reach players in-game. We reach them everywhere else - YouTube, TikTok, Instagram.",
    },
    {
        icon: Network,
        title: "Largest Creator Network",
        description: "Access 50M+ combined subscribers across our creator network. Real creators making authentic content that converts.",
    },
    {
        icon: Activity,
        title: "Viral Potential",
        description: "Short-form content goes viral. One clip can generate millions of views and thousands of new players overnight.",
    },
    {
        icon: CheckCircle2,
        title: "Quality Controlled",
        description: "Every submission is manually reviewed. No bots, no fake views - only real engagement from real creators.",
    },
    {
        icon: BarChart3,
        title: "Pay Per Performance",
        description: "Only pay for approved views. Set your RPM, your budget, your rules. Full transparency on every dollar spent.",
    },
    {
        icon: Timer,
        title: "Launch in Minutes",
        description: "Create a campaign, fund it, and watch creators start promoting fast.",
    },
];

export default function WhyBloxClips() {
    return (
        <section className="py-24 bg-[#0a0a0a] border-y border-[#1f1f1f]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
                        The BloxClips Advantage
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        What Roblox sponsors can&apos;t do
                    </h3>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        Traditional ads only reach players already on Roblox. We reach the millions who haven&apos;t discovered you yet.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#333] mb-6">
                                <reason.icon className="w-5 h-5 text-gray-300" strokeWidth={2} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-3">
                                {reason.title}
                            </h4>
                            <p className="text-gray-400 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 pt-12 border-t border-[#1f1f1f]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto text-center">
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                                50M+
                            </div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                                Creator Subscribers
                            </div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                                100M+
                            </div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                                Views Generated
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
