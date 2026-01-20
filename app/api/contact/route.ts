import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazy initialize to avoid build-time errors
let resend: Resend | null = null;
function getResend() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}
const LOGO_URL = 'https://bloxclips.com/logo.png';

// Brand design system - Refined for Floating Dark Theme
const BRAND = {
    colors: {
        bg: '#000000',          // Pure black outer
        surface: '#111111',     // Dark gray card
        border: 'rgba(255,255,255,0.12)', // Subtle border
        primary: '#3b82f6',     // Blue 500
        primaryDark: '#2563eb', // Blue 600
        text: '#ffffff',
        textSecondary: '#a1a1aa', // Zinc 400
        textTertiary: '#71717a',  // Zinc 500
        accent: '#60a5fa',      // Blue 400
    },
    fonts: {
        main: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    }
};

export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('[Contact] RESEND_API_KEY not configured');
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'manicbusinesses@gmail.com';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <title>BloxClips</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.colors.bg}; font-family: ${BRAND.fonts.main}; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding: 0 20px;">
                <table width="100%" style="max-width: 600px; margin: 0 auto;" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 48px 0 32px;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="text-align: center;">
                                        <span style="color: ${BRAND.colors.text}; font-size: 32px; font-weight: 800; letter-spacing: -1px; display: block; line-height: 1.2;">BloxClips</span>
                                        <span style="color: ${BRAND.colors.accent}; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; display: block; margin-top: 8px;">Roblox's #1 Clipping Platform</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content Card -->
                    <tr>
                        <td style="background-color: ${BRAND.colors.surface}; border: 1px solid ${BRAND.colors.border}; border-radius: 20px; padding: 48px 40px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 24px;">
                                        <span style="background: rgba(96, 165, 250, 0.1); color: ${BRAND.colors.accent}; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 100px; border: 1px solid rgba(96, 165, 250, 0.2); letter-spacing: 0.5px;">CONTACT FORM</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 32px;">
                                        <h1 style="margin: 0; color: ${BRAND.colors.text}; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; text-align: center;">New Message Received</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.03); border: 1px solid ${BRAND.colors.border}; border-radius: 16px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 20px; border-bottom: 1px solid ${BRAND.colors.border};">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 60px; font-size: 14px; color: ${BRAND.colors.textTertiary};">From</td>
                                                            <td style="font-size: 15px; color: ${BRAND.colors.text}; font-weight: 600;">${name.replace(/</g, '&lt;')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px; border-bottom: 1px solid ${BRAND.colors.border};">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 60px; font-size: 14px; color: ${BRAND.colors.textTertiary};">Email</td>
                                                            <td style="font-size: 15px; color: ${BRAND.colors.primary}; font-family: monospace;">${email}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 24px; background: rgba(0,0,0,0.2);">
                                                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: ${BRAND.colors.textSecondary}; white-space: pre-wrap;">${message.replace(/</g, '&lt;')}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: ${BRAND.colors.textTertiary}; font-size: 13px; text-align: center;">
                                            Reply to this email to respond directly to ${name}.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 48px; border-top: 1px solid ${BRAND.colors.border}; text-align: center;">
                            <p style="margin: 0; color: ${BRAND.colors.textTertiary}; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} BloxClips. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Spacer -->
                    <tr><td height="60"></td></tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();

        const resendClient = getResend();
        if (!resendClient) {
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        const { data, error } = await resendClient.emails.send({
            from: `BloxClips Contact <${fromEmail}>`,
            to: toEmail,
            subject: `New Message: ${name}`,
            replyTo: email,
            html,
            text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
        });

        if (error) {
            console.error('[Contact] Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email', details: { message: error.message } }, { status: 500 });
        }

        return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
    } catch (error) {
        console.error('[Contact] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


