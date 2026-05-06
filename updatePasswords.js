const fs = require('fs');

let content = fs.readFileSync('prisma/seed.js', 'utf8');

// Match each faculty entry and capture their vceId and the old passwordHash
const regex = /{ name: "[^"]+", designation: "[^"]+", vceId: "([^"]+)", email: "[^"]+", phone: "[^"]+", role: "[^"]+", passwordHash: "([^"]+)" }/g;

content = content.replace(regex, (match, vceId, oldHash) => {
  return match.replace(`passwordHash: "${oldHash}"`, `passwordHash: "${vceId}"`);
});

fs.writeFileSync('prisma/seed.js', content);
console.log('Successfully updated seed.js!');
