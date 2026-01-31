import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getAllPosts(lang: 'ko' | 'en'): Promise<BlogPost[]> {
  const allPosts = await getCollection('blog', ({ id }) => {
    return id.startsWith(`${lang}/`);
  });

  return allPosts.sort((a, b) =>
    new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );
}

export async function getPost(slug: string, lang: 'ko' | 'en'): Promise<BlogPost | undefined> {
  const posts = await getAllPosts(lang);
  return posts.find(p => p.slug === slug);
}

export async function getRecentPosts(lang: 'ko' | 'en', limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts(lang);
  return posts.slice(0, limit);
}

export async function getRelatedPosts(slugs: string[], lang: 'ko' | 'en'): Promise<BlogPost[]> {
  const posts = await getAllPosts(lang);
  return posts.filter(p => slugs.includes(p.slug));
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const koreanCharsPerMinute = 500;

  // Count Korean characters
  const koreanChars = (content.match(/[\uAC00-\uD7AF]/g) || []).length;
  // Count words (for English/numbers)
  const words = content.replace(/[\uAC00-\uD7AF]/g, '').split(/\s+/).filter(w => w.length > 0).length;

  const koreanMinutes = koreanChars / koreanCharsPerMinute;
  const englishMinutes = words / wordsPerMinute;

  return Math.max(1, Math.ceil(koreanMinutes + englishMinutes));
}

export function generateFaqSchema(faq: { question: string; answer: string }[], url: string) {
  if (!faq || faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export function generateArticleSchema(post: BlogPost, url: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.data.title,
    "description": post.data.description,
    "image": `${siteUrl}/og/blog.svg`,
    "datePublished": post.data.publishDate.toISOString(),
    "dateModified": post.data.publishDate.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "JudySylph",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "JudySylph",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/favicon.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": post.data.keywords.join(', ')
  };
}
