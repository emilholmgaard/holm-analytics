'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params?.siteId as string;
  const [site, setSite] = useState<any>(null);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch site data
    fetch(`/api/sites/${siteId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.site) {
          setSite(data.site);
          setVerified(data.site.verified);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteId]);

  const handleVerify = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/sites/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: site.scriptId }),
      });

      const data = await response.json();

      if (data.verified) {
        setVerified(true);
        // Update site state
        setSite({ ...site, verified: true });
      } else {
        alert(data.message || 'Site not verified yet. Make sure the script is installed correctly.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!site) {
    return <div className="min-h-screen flex items-center justify-center">Site not found</div>;
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Installation verified!</h2>
            <p className="text-gray-600 mb-6">
              Your site <strong>{site.domain}</strong> is now tracking analytics.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Verify installation</h2>
          <p className="text-gray-600 mb-6">
            Make sure you've added the script to your website, then click the button below to verify.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Tip:</strong> Visit your website after installing the script to generate a page view, 
              then come back here to verify.
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={checking}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {checking ? 'Checking...' : 'Verify installation'}
          </button>

          <div className="mt-6 pt-6 border-t">
            <Link
              href={`/sites/${siteId}/install`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to installation instructions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

