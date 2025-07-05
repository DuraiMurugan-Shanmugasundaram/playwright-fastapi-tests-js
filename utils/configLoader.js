
const fs = require('fs');
const path = require('path');

function loadConfig() {
  const env = process.env.NODE_ENV || 'dev';  //Set the environment on where your tests should run(dev/prod/qa)
  const configPath = path.resolve(__dirname, `../config/${env}.json`);

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
  } catch (err) {
    console.error(`Failed to load config for environment '${env}':`, err);
    process.exit(1);
  }
}

module.exports = { loadConfig };
