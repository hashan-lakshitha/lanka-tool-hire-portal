require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const models = require('../src/models');

async function main() {
  await models.sequelize.authenticate();

  const tools = await models.Tool.findAll();
  if (tools.length === 0) {
    console.error('No tools found — run scripts/seed.js first.');
    process.exit(1);
  }

  let jamie = await models.User.findOne({ where: { email: 'jamie@example.com' } });
  if (!jamie) {
    jamie = await models.User.create({
      name: 'Jamie Carter',
      email: 'jamie@example.com',
      passwordHash: await bcrypt.hash('customer123', 10),
    });
  }

  let priya = await models.User.findOne({ where: { email: 'priya@example.com' } });
  if (!priya) {
    priya = await models.User.create({
      name: 'Priya Shah',
      email: 'priya@example.com',
      passwordHash: await bcrypt.hash('customer123', 10),
    });
  }

  const admin = await models.AdminUser.findOne({ where: { email: 'admin@toolhire.com' } });

  const findTool = (name) => tools.find((t) => t.name === name);

  const sampleReviews = [
    {
      tool: findTool('Petrol hedge trimmer'),
      user: jamie,
      title: 'Made light work of an overgrown hedge',
      body: 'Had a hedge that hadn\'t been touched in two years. This cut through the thick growth without stalling once. Started first pull every time.',
      ratings: [5, 4, 4, 5],
      status: 'approved',
      response: 'Thanks Jamie — glad it handled the job. Let us know if you need it again next season!',
    },
    {
      tool: findTool('Petrol hedge trimmer'),
      user: priya,
      title: 'Good but a bit heavy for long sessions',
      body: 'Works well, cuts cleanly, but my arms were tired after about an hour of continuous use. Worth taking breaks.',
      ratings: [4, 5, 3, 4],
      status: 'approved',
      comment: { user: jamie, body: 'Totally agree, I found gloves with extra padding helped a lot.' },
    },
    {
      tool: findTool('Concrete mixer 140L'),
      user: priya,
      title: 'Solid mixer, easy to clean',
      body: 'Used it for a small patio job over the weekend. Mixed consistently and the drum was easy to rinse out afterwards.',
      ratings: [5, 5, 4, 5],
      status: 'approved',
    },
    {
      tool: findTool('Airless paint sprayer'),
      user: jamie,
      title: 'Great coverage on fence panels',
      body: 'Sprayed a whole run of fencing in under an hour. Even coverage, minimal overspray once I got the technique right.',
      ratings: [5, 4, 5, 4],
      status: 'approved',
    },
    {
      tool: findTool('Drain unblocking machine'),
      user: priya,
      title: 'Cleared a stubborn blockage',
      body: 'Nothing else worked on our kitchen drain, but this sorted it in about 15 minutes. Instructions could be clearer though.',
      ratings: [5, 3, 3, 4],
      status: 'pending',
    },
    {
      tool: findTool('Industrial space heater'),
      user: jamie,
      title: 'Warmed up the garage fast',
      body: 'Heated a fairly large garage space within minutes. A bit loud but does the job well.',
      ratings: [4, 4, 4, 4],
      status: 'pending',
    },
  ];

  let created = 0;
  for (const sample of sampleReviews) {
    if (!sample.tool) continue;

    const review = await models.Review.create({
      toolId: sample.tool.id,
      userId: sample.user.id,
      title: sample.title,
      body: sample.body,
      performanceRating: sample.ratings[0],
      customerServiceRating: sample.ratings[1],
      supportRating: sample.ratings[2],
      afterSalesRating: sample.ratings[3],
      status: sample.status,
      moderatedByAdminId: sample.status === 'approved' ? admin?.id : null,
      moderatedAt: sample.status === 'approved' ? new Date() : null,
    });
    created += 1;

    if (sample.comment) {
      await models.ReviewComment.create({
        reviewId: review.id,
        userId: sample.comment.user.id,
        body: sample.comment.body,
        status: 'approved',
      });
    }

    if (sample.response && admin) {
      await models.CompanyResponse.create({
        reviewId: review.id,
        adminUserId: admin.id,
        body: sample.response,
      });
    }
  }

  console.log(`Seeded ${created} reviews (mix of approved and pending).`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Seeding reviews failed:', error);
  process.exit(1);
});