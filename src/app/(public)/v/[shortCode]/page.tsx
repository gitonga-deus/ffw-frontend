import { redirect } from 'next/navigation';

interface ShortUrlPageProps {
    params: Promise<{
        shortCode: string;
    }>;
}

/**
 * Short URL handler for certificate verification.
 * Redirects /v/{shortCode} to /verify-certificate/{fullCertId}
 *
 * The short code is the first 6 characters of the hex part of the cert ID.
 * Example: /v/5A5A93 -> /verify-certificate/CERT-1763385744-5A5A9345
 */
export default async function ShortUrlPage({ params }: ShortUrlPageProps) {
    const { shortCode } = await params;

    // Look up the full cert ID from the backend using the short code
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(
            `${apiUrl}/api/certificates/lookup/${shortCode.toUpperCase()}`,
            {
                cache: 'no-store',
            }
        );

        if (response.ok) {
            const data = await response.json();

            // Validate that we got a certification_id
            if (data && data.certification_id) {
                redirect(`/verify-certificate/${data.certification_id}`);
            } else {
                console.error('Invalid response from lookup API:', data);
                redirect(`/verify-certificate/INVALID?error=invalid_response`);
            }
        } else {
            const errorText = await response.text();
            console.error(`Lookup failed with status ${response.status}:`, errorText);
            // If not found, show error on verify page
            redirect(`/verify-certificate/NOT_FOUND?error=not_found&code=${shortCode}`);
        }
    } catch (error: any) {
        // Check if this is a Next.js redirect (which is expected)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Re-throw redirect errors
        }

        console.error('Error looking up certificate:', error);
        // If lookup fails, redirect to verify page with error
        redirect(`/verify-certificate/ERROR?error=lookup_failed&code=${shortCode}`);
    }
}
