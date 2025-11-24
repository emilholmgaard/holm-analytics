import Link from "next/link";

export default function Home() {
  // Analytics server URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.holmkonsultering.dk';

  const scriptCode = `<script defer data-domain="yourdomain.com" data-api="${baseUrl}/api/track" src="${baseUrl}/analytics.js"></script>`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Holm Analytics</h1>
        <p className="text-xl text-gray-600 mb-12">
          Simpel web analytics - som Plausible, men enklere
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Sådan bruger du det</h2>
          <p className="text-gray-700 mb-6">
            Tilføj dette script til din hjemmeside for at starte tracking:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
            <code className="text-green-400 text-sm whitespace-pre">
              {scriptCode}
            </code>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Tilpas data-domain</h3>
              <p className="text-gray-600 text-sm">
                Erstat <code className="bg-gray-100 px-1 rounded">yourdomain.com</code> med dit eget domæne
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Tilpas data-api (hvis nødvendigt)</h3>
              <p className="text-gray-600 text-sm">
                Hvis du deployer til en anden URL, skal du opdatere <code className="bg-gray-100 px-1 rounded">data-api</code> attributten
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Se dine analytics</h3>
              <p className="text-gray-600 text-sm">
                Gå til <Link href="/dashboard" className="text-blue-600 hover:underline">dashboard</Link> for at se dine data
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Eksempel</h3>
          <p className="text-blue-800 text-sm mb-4">
            For at tracke <code className="bg-blue-100 px-1 rounded">www.holmkonsultering.dk</code>, så brug:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400 text-sm whitespace-pre">
{`<script defer 
  data-domain="www.holmkonsultering.dk" 
  data-api="${baseUrl}/api/track" 
  src="${baseUrl}/analytics.js">
</script>`}
            </code>
          </div>
          <p className="text-blue-800 text-sm mt-4">
            <strong>Vigtigt:</strong> Scriptet sender data til API endpointet på <code className="bg-blue-100 px-1 rounded">{baseUrl}/api/track</code>, som derefter gemmer data i databasen. Dette er standard praksis for analytics services.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
