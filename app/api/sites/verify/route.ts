import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { verifySite } from '@/lib/sites';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scriptId } = body;

    if (!scriptId) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      );
    }

    // Verify the site belongs to the user
    const site = await prisma.site.findUnique({
      where: { scriptId },
    });

    if (!site || site.userId !== user.id) {
      return NextResponse.json(
        { error: 'Site not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if site has received any page views (verification)
    const pageViewCount = await prisma.pageView.count({
      where: { siteId: site.id },
    });

    if (pageViewCount === 0) {
      return NextResponse.json({
        verified: false,
        message: 'No page views detected yet. Make sure the script is installed correctly.',
      });
    }

    // Mark as verified
    await verifySite(scriptId);

    return NextResponse.json({
      verified: true,
      message: 'Site verified successfully!',
    });
  } catch (error) {
    console.error('Verify site error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

