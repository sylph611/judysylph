import type { APIRoute, GetStaticPaths } from 'astro';
import { getTest, getAllTests } from '../../../utils/tests';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string; type: string } }[] = [];

  // Generate for both languages
  ['ko', 'en'].forEach((lang) => {
    const tests = getAllTests(lang);
    tests.forEach((test) => {
      test.results.forEach((result) => {
        // Avoid duplicates
        const key = `${test.slug}-${result.type}`;
        if (!paths.find(p => `${p.params.slug}-${p.params.type}` === key)) {
          paths.push({
            params: { slug: test.slug, type: result.type },
          });
        }
      });
    });
  });

  return paths;
};

export const GET: APIRoute = async ({ params }) => {
  const { slug, type } = params;

  // Try to get test from either language
  let test = getTest(slug!, 'ko') || getTest(slug!, 'en');
  if (!test) {
    return new Response('Not found', { status: 404 });
  }

  const result = test.results.find(r => r.type === type);
  if (!result) {
    return new Response('Not found', { status: 404 });
  }

  // Generate SVG OG image
  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f8fafc"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Card -->
  <rect x="60" y="60" width="1080" height="510" rx="32" fill="url(#card)" opacity="0.95"/>

  <!-- Emoji -->
  <text x="600" y="220" text-anchor="middle" font-size="120">${result.emoji || test.emoji}</text>

  <!-- Result Title -->
  <text x="600" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#1f2937">
    ${escapeXml(result.title)}
  </text>

  <!-- Test Name -->
  <text x="600" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#6b7280">
    ${escapeXml(test.title)}
  </text>

  <!-- Traits (up to 4) -->
  <g transform="translate(600, 480)">
    ${result.traits.slice(0, 4).map((trait, i) => {
      const x = (i - (Math.min(result.traits.length, 4) - 1) / 2) * 140;
      return `
        <g transform="translate(${x}, 0)">
          <rect x="-60" y="-20" width="120" height="40" rx="20" fill="#6366f1" opacity="0.1"/>
          <text x="0" y="6" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6366f1">${escapeXml(trait)}</text>
        </g>
      `;
    }).join('')}
  </g>

  <!-- Site Name -->
  <text x="1140" y="600" text-anchor="end" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.9">
    JudySylph
  </text>
</svg>
`.trim();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
