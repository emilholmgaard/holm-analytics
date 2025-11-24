'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InstallPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params?.siteId as string;
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.holmkonsultering.dk';

  useEffect(() => {
    // Fetch site data
    fetch(`/api/sites/${siteId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.site) {
          setSite(data.site);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteId]);

  const scriptCode = `<!-- Privacy-friendly analytics by Holm Analytics -->
<script async src="${baseUrl}/api/script/${site?.scriptId}"></script>
<script>
  window.holmAnalytics=window.holmAnalytics||function(){(holmAnalytics.q=holmAnalytics.q||[]).push(arguments)},holmAnalytics.init=holmAnalytics.init||function(i){holmAnalytics.o=i||{}};
  holmAnalytics.init()
</script>`;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!site) {
    return <div className="min-h-screen flex items-center justify-center">Site not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Install Holm Analytics</h2>
          <p className="text-gray-600 mb-6">
            Add this script to your website's <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code> section:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
              {scriptCode}
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Where to add it?</h3>
            <p className="text-blue-800 text-sm">
              Paste the code above into the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your website, 
              just before the closing <code className="bg-blue-100 px-1 rounded">&lt;/head&gt;</code> tag.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(scriptCode);
                alert('Script copied to clipboard!');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Copy script
            </button>
            <button
              onClick={() => router.push(`/sites/${siteId}/verify`)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              I've installed it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

