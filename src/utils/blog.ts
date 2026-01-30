export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  emoji: string;
  category: string;
  publishedAt: string;
  readingTime: number;
}

import blogKo from '../content/blog/ko.json';
import blogEn from '../content/blog/en.json';

const postsKo: BlogPost[] = blogKo;
const postsEn: BlogPost[] = blogEn;

export function getAllPosts(lang: string): BlogPost[] {
  return lang === 'ko' ? postsKo : postsEn;
}

export function getPost(slug: string, lang: string): BlogPost | undefined {
  const posts = getAllPosts(lang);
  return posts.find(p => p.slug === slug);
}

export function getRecentPosts(lang: string, limit: number = 3): BlogPost[] {
  return getAllPosts(lang)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
