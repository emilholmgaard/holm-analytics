// Database storage using Prisma
import { prisma } from './prisma';

export interface PageViewInput {
  domain: string;
  url: string;
  referrer: string;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  timestamp: string;
  siteId?: string;
}

export interface PageView {
  domain: string;
  url: string;
  referrer: string;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  timestamp: string;
}

class AnalyticsStorage {
  async addPageView(view: PageViewInput): Promise<void> {
    await prisma.pageView.create({
      data: {
        domain: view.domain,
        url: view.url,
        referrer: view.referrer || '',
        screenWidth: view.screen.width,
        screenHeight: view.screen.height,
        viewportWidth: view.viewport.width,
        viewportHeight: view.viewport.height,
        timestamp: new Date(view.timestamp),
        siteId: view.siteId || null,
      },
    });
  }

  async getPageViews(domain?: string): Promise<PageView[]> {
    const where = domain ? { domain } : {};
    const views = await prisma.pageView.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    return views.map((view) => ({
      domain: view.domain,
      url: view.url,
      referrer: view.referrer,
      screen: {
        width: view.screenWidth,
        height: view.screenHeight,
      },
      viewport: {
        width: view.viewportWidth,
        height: view.viewportHeight,
      },
      timestamp: view.timestamp.toISOString(),
    }));
  }

  async getTotalViews(domain?: string): Promise<number> {
    const where = domain ? { domain } : {};
    return prisma.pageView.count({ where });
  }

  async getUniqueDomains(): Promise<string[]> {
    const domains = await prisma.pageView.findMany({
      select: { domain: true },
      distinct: ['domain'],
    });
    return domains.map((d) => d.domain);
  }

  async getStats(domain?: string) {
    const where = domain ? { domain } : {};
    
    const [totalViews, views] = await Promise.all([
      prisma.pageView.count({ where }),
      this.getPageViews(domain),
    ]);

    const uniqueUrls = new Set(views.map((v) => v.url)).size;
    const uniqueReferrers = new Set(
      views.filter((v) => v.referrer).map((v) => v.referrer)
    ).size;

    return {
      totalViews,
      uniquePages: uniqueUrls,
      uniqueReferrers,
      views,
    };
  }
}

// Singleton instance
export const storage = new AnalyticsStorage();

