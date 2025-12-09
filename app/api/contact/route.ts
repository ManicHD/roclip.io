import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_f8FSnjmW_LMBAdTWxX3KQsNqy98r9NFtu');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate inputs
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: 'manicbusinesses@gmail.com',
            subject: `New Message from ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to send email',
                    details: {
                        message: error.message,
                        name: error.name,
                        code: (error as any).statusCode || (error as any).code
                    }
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Email sent successfully', data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
