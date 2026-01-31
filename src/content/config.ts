import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    category: z.string(),
    emoji: z.string().default('📝'),
    relatedTool: z.string(),
    relatedPosts: z.array(z.string()).optional().default([]),
    keywords: z.array(z.string()),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional().default([])
  })
});

export const collections = {
  'blog': blogCollection
};
