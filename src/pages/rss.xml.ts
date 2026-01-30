import type { APIRoute } from 'astro';
import blogPostsKo from '../content/blog/ko.json';
import blogPostsEn from '../content/blog/en.json';

const siteUrl = 'https://judysylph.com';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  emoji: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

function generateRssItem(post: BlogPost, lang: string): string {
  const postUrl = `${siteUrl}/${lang}/blog/${post.slug}`;
  const pubDate = new Date(post.publishedAt).toUTCString();

  return `
    <item>
      <title><![CDATA[${post.emoji} ${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'ko';

  const posts: BlogPost[] = lang === 'en' ? blogPostsEn : blogPostsKo;
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const channelTitle = lang === 'ko' ? 'JudySylph 블로그' : 'JudySylph Blog';
  const channelDesc =
    lang === 'ko'
      ? '심리 테스트와 자기 발견에 대한 유용한 정보를 제공합니다.'
      : 'Useful information about psychology tests and self-discovery.';

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
