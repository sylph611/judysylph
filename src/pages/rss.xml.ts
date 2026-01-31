import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const siteUrl = 'https://judysylph.com';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRssItem(post: {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  publishDate: Date;
}, lang: string): string {
  const postSlug = post.slug.replace(new RegExp(`^${lang}/`), '');
  const postUrl = `${siteUrl}/${lang}/blog/${postSlug}`;
  const pubDate = post.publishDate.toUTCString();

  return `
    <item>
      <title><![CDATA[${post.emoji} ${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'ko';

  // Get posts from content collection
  const allPosts = await getCollection('blog', ({ id }) => id.startsWith(`${lang}/`));

  const sortedPosts = allPosts
    .map(post => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      emoji: post.data.emoji,
      category: post.data.category,
      publishDate: post.data.publishDate,
    }))
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

  const channelTitle = lang === 'ko' ? 'JudySylph 블로그' : 'JudySylph Blog';
  const channelDesc =
    lang === 'ko'
      ? '재무, 세금, 부동산 등 실용적인 정보와 계산 가이드를 제공합니다.'
      : 'Practical guides on finance, taxes, real estate, and useful calculators.';

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${channelTitle}</title>
    <link>${siteUrl}/${lang}/blog</link>
    <description>${channelDesc}</description>
    <language>${lang === 'ko' ? 'ko-KR' : 'en-US'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml?lang=${lang}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/favicon.svg</url>
      <title>${channelTitle}</title>
      <link>${siteUrl}/${lang}</link>
    </image>
    ${sortedPosts.map((post) => generateRssItem(post, lang)).join('')}
  </channel>
</rss>`;

  return new Response(rssContent.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
