import { NextRequest, NextResponse } from 'next/server';
import { getSiteByScriptId } from '@/lib/sites';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scriptId: string }> }
) {
  try {
    const { scriptId } = await params;
    
    // Verify script ID exists
    const site = await getSiteByScriptId(scriptId);
    
    if (!site) {
      return new NextResponse('Site not found', { status: 404 });
    }

    // Read the analytics script
    const scriptPath = join(process.cwd(), 'public', 'analytics.js');
    let script = readFileSync(scriptPath, 'utf-8');
    
    // Replace placeholders with actual values
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.holmkonsultering.dk';
    script = script.replace('{{SCRIPT_ID}}', scriptId);
    script = script.replace('{{API_ENDPOINT}}', `${baseUrl}/api/track`);
    script = script.replace('{{DOMAIN}}', site.domain);

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Script error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

