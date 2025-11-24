import { prisma } from '../lib/prisma';

async function clearDatabase() {
  console.log('Deleting all data from database...');
  
  try {
    // Delete in correct order (respecting foreign keys)
    const pageViewsDeleted = await prisma.pageView.deleteMany({});
    console.log(`✓ Deleted ${pageViewsDeleted.count} page views`);
    
    const sitesDeleted = await prisma.site.deleteMany({});
    console.log(`✓ Deleted ${sitesDeleted.count} sites`);
    
    const usersDeleted = await prisma.user.deleteMany({});
    console.log(`✓ Deleted ${usersDeleted.count} users`);
    
    console.log('\n✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();

