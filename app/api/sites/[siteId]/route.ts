import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { siteId } = await params;
    
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site || site.userId !== user.id) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      site: {
        id: site.id,
        domain: site.domain,
        timezone: site.timezone,
        scriptId: site.scriptId,
        verified: site.verified,
        createdAt: site.createdAt,
      },
    });
  } catch (error) {
    console.error('Get site error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

