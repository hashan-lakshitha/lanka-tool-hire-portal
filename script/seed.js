require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const models = require('../src/models');

async function main() {
  await models.sequelize.authenticate();

  const buildingConstruction = await models.Category.create({ name: 'Building construction equipment' });
  const cleaning = await models.Category.create({ name: 'Cleaning equipment' });
  const decorating = await models.Category.create({ name: 'Decorating tools' });
  const landscaping = await models.Category.create({ name: 'Landscaping tools' });
  const electricalHeating = await models.Category.create({ name: 'Electrical and heating tools' });
  const plumbing = await models.Category.create({ name: 'Plumbing tools' });

  const tools = await models.Tool.bulkCreate([
    {
      categoryId: landscaping.id,
      name: 'Petrol hedge trimmer',
      description: 'Petrol-powered, 60cm blade, ideal for thick hedges and shrubs.',
      hourlyRate: 8.0,
      dailyRate: 25.0,
      weeklyRate: 110.0,
    },
    {
      categoryId: buildingConstruction.id,
      name: 'Concrete mixer 140L',
      description: 'Electric 140L drum mixer, suitable for small to medium concrete jobs.',
      hourlyRate: 10.0,
      dailyRate: 35.0,
      weeklyRate: 150.0,
    },
    {
      categoryId: cleaning.id,
      name: 'Industrial carpet cleaner',
      description: 'Hot water extraction carpet cleaner for large commercial areas.',
      hourlyRate: 6.5,
      dailyRate: 22.0,
      weeklyRate: 95.0,
    },
    {
      categoryId: decorating.id,
      name: 'Airless paint sprayer',
      description: 'Handheld airless sprayer for fast, even coverage on walls and fences.',
      hourlyRate: 5.0,
      dailyRate: 18.0,
      weeklyRate: 75.0,
    },
    {
      categoryId: electricalHeating.id,
      name: 'Industrial space heater',
      description: '15kW diesel space heater for drying out sites or heating workshops.',
      hourlyRate: 4.0,
      dailyRate: 15.0,
      weeklyRate: 65.0,
    },
    {
      categoryId: plumbing.id,
      name: 'Drain unblocking machine',
      description: 'Electric drain auger, clears blockages up to 30 metres.',
      hourlyRate: 7.0,
      dailyRate: 24.0,
      weeklyRate: 100.0,
    },
  ]);

  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  await models.User.create({
    name: 'Jamie Carter',
    email: 'jamie@example.com',
    passwordHash: customerPasswordHash,
  });

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await models.AdminUser.create({
    name: 'Site moderator',
    email: 'admin@toolhire.com',
    passwordHash: adminPasswordHash,
    role: 'manager',
  });

  console.log(`Seeded ${tools.length} tools across 6 categories.`);
  console.log('Customer login: jamie@example.com / customer123');
  console.log('Admin login: admin@toolhire.com / admin123');

  process.exit(0);
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});