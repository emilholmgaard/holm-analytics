import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getSiteByScriptId } from '@/lib/sites';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.scriptId || !body.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }
    
    // Get site by script ID
    const site = await getSiteByScriptId(body.scriptId);
    
    if (!site) {
      return NextResponse.json(
        { error: 'Invalid script ID' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }
    
    // Add to storage with site ID
    await storage.addPageView({
      domain: body.domain || site.domain,
      url: body.url,
      referrer: body.referrer || '',
      screen: body.screen || { width: 0, height: 0 },
      viewport: body.viewport || { width: 0, height: 0 },
      timestamp: body.timestamp || new Date().toISOString(),
      siteId: site.id,
    });
    
    // Log successful tracking for debugging
    console.log('✅ Page view tracked:', {
      scriptId: body.scriptId,
      domain: body.domain || site.domain,
      url: body.url,
      siteId: site.id,
    });
    
    // Return 204 No Content (like Plausible)
    return new NextResponse(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Tracking error:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Export data for dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siteId = searchParams.get('siteId');
    const domain = searchParams.get('domain');
    
    let stats;
    if (siteId) {
      // Get stats for a specific site
      const site = await prisma.site.findUnique({
        where: { id: siteId },
      });
      if (site) {
        stats = await storage.getStats(site.domain);
      } else {
        stats = { totalViews: 0, uniquePages: 0, uniqueReferrers: 0, views: [] };
      }
    } else {
      stats = await storage.getStats(domain || undefined);
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

