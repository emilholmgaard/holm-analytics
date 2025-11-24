import { prisma } from '../lib/prisma';

async function checkPageViews() {
  try {
    const scriptId = 'pa-5c_L8Ep2vL4xab-6';
    
    const site = await prisma.site.findUnique({
      where: { scriptId },
      include: {
        pageViews: {
          take: 10,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!site) {
      console.log('❌ Site not found with scriptId:', scriptId);
      return;
    }

    console.log('✅ Site found:');
    console.log('  Domain:', site.domain);
    console.log('  Script ID:', site.scriptId);
    console.log('  Verified:', site.verified);
    console.log('  Total page views:', site.pageViews.length);
    
    if (site.pageViews.length > 0) {
      console.log('\n📊 Recent page views:');
      site.pageViews.forEach((view, i) => {
        console.log(`  ${i + 1}. ${view.url} - ${view.timestamp.toISOString()}`);
      });
    } else {
      console.log('\n⚠️  No page views found yet.');
      console.log('   Make sure the script is installed correctly on Trust Security website.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPageViews();

