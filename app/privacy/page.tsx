import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-black text-white py-20 px-8">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p>
                            ClipRoblox ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-2">We may collect the following types of information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Account information (username, email address)</li>
                            <li>Gameplay clips and content you upload</li>
                            <li>Usage data and analytics</li>
                            <li>Device information and IP address</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="mb-2">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide and maintain our service</li>
                            <li>Process and store your clips</li>
                            <li>Improve our platform and user experience</li>
                            <li>Communicate with you about your account</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Sharing Your Information</h2>
                        <p>
                            We do not sell your personal information. We may share your information only in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>With your explicit consent</li>
                            <li>To comply with legal requirements</li>
                            <li>To protect our rights and safety</li>
                            <li>With service providers who assist in our operations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                        <p className="mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Access your personal information</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of certain data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                        <p>
                            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us through our Discord server or email.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

