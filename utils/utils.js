const fs = require('fs');

function parseTestSummary(reportPath) {
  try {
    const content = fs.readFileSync(reportPath, 'utf8');
    const extractCount = (label) => {
      const match = content.match(new RegExp(`${label}.*?(\d+)`, 'i'));
      return match ? parseInt(match[1], 10) : 0;
    };
    return {
      passed: extractCount('Passed'),
      failed: extractCount('Failed'),
      skipped: extractCount('Skipped')
    };
  } catch (error) {
    console.error('Failed to parse summary:', error);
    return { passed: 0, failed: 0, skipped: 0 };
  }
}
module.exports = { parseTestSummary };
