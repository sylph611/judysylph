#!/usr/bin/env node

/**
 * Script to add Breadcrumb and HowTo schemas to tool pages
 */

const fs = require('fs');
const path = require('path');

const toolsDir = {
  ko: path.join(__dirname, '../src/pages/ko/tools'),
  en: path.join(__dirname, '../src/pages/en/tools')
};

// Files to skip
const skipFiles = ['index.astro'];

function processToolFile(filePath, lang) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  // Skip non-tool pages
  if (skipFiles.includes(fileName)) {
    console.log(`⏭️  Skipping ${fileName}`);
    return;
  }

  // Check if already updated
  if (content.includes('generateToolBreadcrumbSchema')) {
    console.log(`⏭️  Already updated: ${fileName}`);
    return;
  }

  // Extract the slug from getTool call
  const getToolMatch = content.match(/getTool\(['"]([^'"]+)['"]/);
  if (!getToolMatch) {
    console.log(`⚠️  Could not find getTool call in ${fileName}`);
    return;
  }
  const slug = getToolMatch[1];

  // Update imports
  let newContent = content.replace(
    /import { getTool } from ['"]\.\.\/\.\.\/\.\.\/utils\/tools['"];/,
    `import { getTool, generateToolBreadcrumbSchema, generateToolHowToSchema, calculatorSteps, getToolStepType } from '../../../utils/tools';`
  );

  // Find the jsonLd definition and add breadcrumb + howto
  const jsonLdPattern = /const jsonLd = \{[\s\S]*?\};/;
  const jsonLdMatch = newContent.match(jsonLdPattern);

  if (!jsonLdMatch) {
    console.log(`⚠️  Could not find jsonLd in ${fileName}`);
    return;
  }

  const siteUrl = 'https://judysylph.com';

  // Create the new jsonLd array
  const newJsonLd = `const siteUrl = '${siteUrl}';
const stepType = getToolStepType('${slug}');
const steps = calculatorSteps['${lang}'][stepType];

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": tool?.title,
  "description": tool?.description,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "${lang === 'ko' ? 'KRW' : 'USD'}" }
};

const breadcrumbSchema = tool ? generateToolBreadcrumbSchema(tool, '${lang}', siteUrl) : null;
const howToSchema = tool ? generateToolHowToSchema(tool, '${lang}', siteUrl, steps) : null;

const jsonLd = [webAppSchema, breadcrumbSchema, howToSchema].filter(Boolean);`;

  newContent = newContent.replace(jsonLdPattern, newJsonLd);

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Updated ${fileName}`);
}

// Process all tool files
let updated = 0;
let skipped = 0;

for (const [lang, dir] of Object.entries(toolsDir)) {
  console.log(`\n📁 Processing ${lang} tools...`);

  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    continue;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('generateToolBreadcrumbSchema')) {
        skipped++;
        console.log(`⏭️  Already updated: ${file}`);
      } else if (skipFiles.includes(file)) {
        skipped++;
        console.log(`⏭️  Skipping: ${file}`);
      } else {
        processToolFile(filePath, lang);
        updated++;
      }
    } catch (error) {
      console.log(`❌ Error processing ${file}: ${error.message}`);
    }
  }
}

console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
