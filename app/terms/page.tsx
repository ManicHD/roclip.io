import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using ClipRoblox, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>
                            ClipRoblox is a platform that allows users to capture, edit, and share Roblox gameplay clips. We provide tools and services to help creators promote Roblox games through video content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <p className="mb-2">When you create an account with us, you must:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account</li>
                            <li>Notify us immediately of any unauthorized use</li>
                            <li>Be responsible for all activities under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                        <p className="mb-2">You agree not to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Upload content that violates any laws or regulations</li>
                            <li>Upload content that infringes on intellectual property rights</li>
                            <li>Upload harmful, abusive, or offensive content</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Use the service for any illegal or unauthorized purpose</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Content Ownership</h2>
                        <p>
                            You retain ownership of any content you upload to ClipRoblox. By uploading content, you grant us a license to use, display, and distribute your content on our platform. You are responsible for ensuring you have the right to upload and share any content you submit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                        <p>
                            The ClipRoblox service, including its original content, features, and functionality, is owned by ClipRoblox and is protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p>
                            We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
                        <p>
                            The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <p>
                            In no event shall ClipRoblox be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us through our Discord server.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

