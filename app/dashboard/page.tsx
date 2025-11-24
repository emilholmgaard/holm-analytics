'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageView {
  domain: string;
  url: string;
  referrer: string;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  timestamp: string;
}

interface Stats {
  totalViews: number;
  uniquePages: number;
  uniqueReferrers: number;
  views: PageView[];
}

interface Site {
  id: string;
  domain: string;
  timezone: string;
  scriptId: string;
  verified: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth and fetch user data
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          setSites(data.user.sites || []);
          if (data.user.sites && data.user.sites.length > 0) {
            setSelectedSiteId(data.user.sites[0].id);
          }
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const fetchStats = async (siteId?: string) => {
    if (!siteId && sites.length > 0) {
      siteId = sites[0].id;
    }
    
    try {
      const url = siteId 
        ? `/api/track?siteId=${encodeURIComponent(siteId)}`
        : '/api/track';
      const response = await fetch(url);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSiteId) {
      fetchStats(selectedSiteId);
      
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchStats(selectedSiteId);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [selectedSiteId]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Holm Analytics Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any sites yet.</p>
            <Link
              href="/sites/add"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add your first site
            </Link>
          </div>
        ) : (
          <>
            {/* Site Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Site:
              </label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.domain} {site.verified ? '✓' : ''}
                  </option>
                ))}
              </select>
              <Link
                href="/sites/add"
                className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add new site
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total Page Views
                </h3>
                <p className="text-3xl font-bold">{stats?.totalViews || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Unique Pages
                </h3>
                <p className="text-3xl font-bold">{stats?.uniquePages || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Unique Referrers
                </h3>
                <p className="text-3xl font-bold">{stats?.uniqueReferrers || 0}</p>
              </div>
            </div>

            {/* Recent Views */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Recent Page Views</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Domain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Referrer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Screen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.views && stats.views.length > 0 ? (
                      [...stats.views].reverse().slice(0, 50).map((view, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(view.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {view.domain}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                            {view.url}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                            {view.referrer || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {view.screen.width} × {view.screen.height}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No page views yet. Make sure your script is installed correctly!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
