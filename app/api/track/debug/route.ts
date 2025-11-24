import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Debug endpoint to check recent page views
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scriptId = searchParams.get('scriptId');
    
    if (scriptId) {
      const site = await prisma.site.findUnique({
        where: { scriptId },
        include: {
          pageViews: {
            take: 10,
            orderBy: { timestamp: 'desc' },
          },
        },
      });
      
      return NextResponse.json({
        site: site ? {
          id: site.id,
          domain: site.domain,
          scriptId: site.scriptId,
          verified: site.verified,
        } : null,
        pageViews: site?.pageViews || [],
        count: site?.pageViews.length || 0,
      });
    }
    
    // Get all recent page views
    const recentViews = await prisma.pageView.findMany({
      take: 20,
      orderBy: { timestamp: 'desc' },
      include: {
        site: {
          select: {
            domain: true,
            scriptId: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      recentViews,
      total: recentViews.length,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

