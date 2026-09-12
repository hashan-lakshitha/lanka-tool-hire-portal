require('dotenv').config({ path: '.env.local' });
const models = require('../src/models');

// Table creation/changes are now handled by sequelize-cli migrations
// (see migrations/), not sequelize.sync(). This script just verifies
// the connection still works - run `npx sequelize-cli db:migrate`
// to actually create/update tables.
async function main() {
  try {
    await models.sequelize.authenticate();
    console.log('Connection to MySQL established successfully.');
    console.log('Run "npx sequelize-cli db:migrate" to apply/update the schema.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

main();