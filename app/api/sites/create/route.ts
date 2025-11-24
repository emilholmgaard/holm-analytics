import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSite } from '@/lib/sites';

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
    const { domain, timezone } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    const site = await createSite(user.id, domain, timezone || 'UTC');

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        domain: site.domain,
        timezone: site.timezone,
        scriptId: site.scriptId,
        verified: site.verified,
      },
    });
  } catch (error) {
    console.error('Create site error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

