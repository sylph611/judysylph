export interface Tool {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
}

import toolsKo from '../content/tools/ko.json';
import toolsEn from '../content/tools/en.json';

export function getAllTools(lang: string): Tool[] {
  return lang === 'ko' ? toolsKo : toolsEn;
}

export function getTool(slug: string, lang: string): Tool | undefined {
  const tools = getAllTools(lang);
  return tools.find(t => t.slug === slug);
}
