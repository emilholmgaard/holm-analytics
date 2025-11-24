import { prisma } from './prisma';
import { randomBytes } from 'crypto';

// Generate unique script ID (similar to Plausible's format)
export function generateScriptId(): string {
  const random = randomBytes(12).toString('base64url').substring(0, 16);
  return `pa-${random}`;
}

export async function createSite(
  userId: string,
  domain: string,
  timezone: string = 'UTC'
) {
  // Clean domain (remove www, https, etc.)
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .toLowerCase();

  // Generate unique script ID
  let scriptId = generateScriptId();
  let exists = await prisma.site.findUnique({ where: { scriptId } });
  
  // Ensure uniqueness
  while (exists) {
    scriptId = generateScriptId();
    exists = await prisma.site.findUnique({ where: { scriptId } });
  }

  return prisma.site.create({
    data: {
      domain: cleanDomain,
      timezone,
      scriptId,
      userId,
    },
  });
}

export async function getSiteByScriptId(scriptId: string) {
  return prisma.site.findUnique({
    where: { scriptId },
  });
}

export async function verifySite(scriptId: string) {
  return prisma.site.update({
    where: { scriptId },
    data: { verified: true },
  });
}

