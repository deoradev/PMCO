const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Colors
  content = content.replace(/text-\[var\(--color-gold-light\)\]/g, 'text-accent-light');
  content = content.replace(/text-\[var\(--color-gold-dark\)\]/g, 'text-accent-dark');
  content = content.replace(/text-\[var\(--color-gold\)\]/g, 'text-accent');
  
  content = content.replace(/bg-\[var\(--color-gold-light\)\]/g, 'bg-accent-light');
  content = content.replace(/bg-\[var\(--color-gold-dark\)\]/g, 'bg-accent-dark');
  content = content.replace(/bg-\[var\(--color-gold\)\]/g, 'bg-accent');
  
  content = content.replace(/border-\[var\(--color-gold-light\)\]/g, 'border-accent-light');
  content = content.replace(/border-\[var\(--color-gold-dark\)\]/g, 'border-accent-dark');
  content = content.replace(/border-\[var\(--color-gold\)\]/g, 'border-accent');
  
  content = content.replace(/from-\[var\(--color-gold-light\)\]/g, 'from-accent-light');
  content = content.replace(/from-\[var\(--color-gold-dark\)\]/g, 'from-accent-dark');
  content = content.replace(/from-\[var\(--color-gold\)\]/g, 'from-accent');
  
  content = content.replace(/to-\[var\(--color-gold-light\)\]/g, 'to-accent-light');
  content = content.replace(/to-\[var\(--color-gold-dark\)\]/g, 'to-accent-dark');
  content = content.replace(/to-\[var\(--color-gold\)\]/g, 'to-accent');
  
  content = content.replace(/bg-\[var\(--color-gold\)\]\/5/g, 'bg-accent/5');
  content = content.replace(/bg-\[var\(--color-gold-light\)\]\/5/g, 'bg-accent-light/5');
  content = content.replace(/border-\[var\(--color-gold\)\]\/30/g, 'border-accent/30');
  content = content.replace(/border-\[var\(--color-gold-light\)\]\/30/g, 'border-accent-light/30');

  // Theme
  content = content.replace(/bg-\[#050505\]/g, 'bg-bg-main');
  content = content.replace(/text-white/g, 'text-text-main');
  content = content.replace(/bg-white\/5/g, 'bg-bg-card');
  content = content.replace(/bg-white\/10/g, 'bg-bg-card-hover');
  content = content.replace(/border-white\/10/g, 'border-border-main');
  content = content.replace(/border-white\/20/g, 'border-border-main');
  content = content.replace(/text-gray-400/g, 'text-text-muted');
  content = content.replace(/text-gray-300/g, 'text-text-muted');
  content = content.replace(/text-gray-500/g, 'text-text-muted');
  content = content.replace(/text-gray-600/g, 'text-text-muted');
  content = content.replace(/text-gray-200/g, 'text-text-main');
  content = content.replace(/bg-black\/50/g, 'bg-bg-input');
  content = content.replace(/bg-\[#0a0a0a\]\/90/g, 'bg-bg-main/90');
  
  // Shadows
  content = content.replace(/shadow-\[0_0_20px_rgba\(212,175,55,0\.15\)\]/g, 'shadow-lg shadow-accent/20');
  content = content.replace(/shadow-\[0_0_20px_rgba\(212,175,55,0\.3\)\]/g, 'shadow-lg shadow-accent/30');
  content = content.replace(/shadow-\[0_0_20px_rgba\(243,229,171,0\.3\)\]/g, 'shadow-lg shadow-accent-light/30');

  // Text black to white for buttons
  content = content.replace(/text-black/g, 'text-white');
  
  fs.writeFileSync(file, content);
});
console.log('Done');
