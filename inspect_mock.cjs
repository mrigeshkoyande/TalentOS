const d = require('./src/lib/ranked_candidates_mock.json');
const first = d[0];
console.log('Count:', d.length);
console.log('Keys:', Object.keys(first).join(', '));
console.log('First entry:', JSON.stringify(first, null, 2));
const gems = d.filter(r => r.isHiddenGem);
console.log('Hidden gems count:', gems.length);
if (gems.length > 0) console.log('First gem:', JSON.stringify(gems[0], null, 2));
