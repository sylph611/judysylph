#!/usr/bin/env node

/**
 * Blog Post Auto-Generator for JudySylph
 *
 * Usage:
 *   node scripts/generate-blog.js --input input.json
 *   node scripts/generate-blog.js --topic "퇴직금 계산" --tool "/ko/tools/severance-calculator" --lang ko
 *
 * Input JSON format:
 * {
 *   "language": "ko",
 *   "topic": "퇴직금 계산 방법",
 *   "targetTool": "/ko/tools/severance-calculator",
 *   "intent": "정보 탐색 + 의사결정"
 * }
 */

const fs = require('fs');
const path = require('path');

// Blog post templates by language
const templates = {
  ko: {
    categoryMap: {
      'severance': '재무/세금',
      'annual-leave': '재무/세금',
      'salary': '재무/세금',
      'tax': '재무/세금',
      'loan': '재무/대출',
      'mortgage': '부동산',
      'apartment': '부동산',
      'jeonse': '부동산',
      'car': '생활/자동차',
      'bmi': '건강',
    },
    emojiMap: {
      'severance': '💰',
      'annual-leave': '🏖️',
      'salary': '💵',
      'tax': '🏛️',
      'loan': '💳',
      'mortgage': '🏦',
      'apartment': '🏢',
      'jeonse': '🏠',
      'car': '🚗',
      'bmi': '⚖️',
    },
    faqTemplates: [
      { q: '{{topic}}은 언제 적용되나요?', a: '{{topic}}은 해당 조건을 충족할 때 적용됩니다. 자세한 내용은 본문을 참고하세요.' },
      { q: '{{topic}} 계산 시 주의할 점은?', a: '정확한 계산을 위해 모든 항목을 빠짐없이 입력해야 합니다. 특히 예외 사항이 있는지 확인하세요.' },
      { q: '{{topic}} 결과가 예상과 다르면?', a: '입력값을 다시 확인하고, 특수한 상황(예: 중간정산, 휴직 등)이 있다면 별도로 고려해야 합니다.' },
    ],
    contentTemplate: `
## {{topic}}이란?

{{topic}}은 많은 사람들이 궁금해하는 주제입니다. 정확한 정보를 알고 있으면 더 나은 결정을 내릴 수 있습니다.

이 글에서는 {{topic}}의 기본 개념부터 실제 계산 방법, 주의사항까지 상세히 알아보겠습니다.

## 기본 개념 이해하기

{{topic}}을 이해하기 위해서는 먼저 기본 개념을 알아야 합니다.

### 핵심 요소

- **첫 번째 요소**: 가장 중요한 기준이 되는 요소입니다
- **두 번째 요소**: 계산에 영향을 미치는 추가 요소입니다
- **세 번째 요소**: 예외 상황에서 고려해야 할 요소입니다

## 계산 방법

{{topic}} 계산은 다음 공식을 따릅니다:

**기본 공식 = 기준값 × 적용률 × 기간**

### 단계별 계산

1. **기준값 확인**: 계산의 기초가 되는 값을 확인합니다
2. **적용률 적용**: 해당하는 비율이나 세율을 적용합니다
3. **최종 계산**: 모든 요소를 종합하여 결과를 도출합니다

## 실제 사례

월급 300만원으로 3년 근무한 경우를 예로 들어보겠습니다:

- 기준값: 300만원
- 적용 기간: 3년
- **예상 결과**: 계산기를 통해 정확한 값을 확인하세요

## 직접 계산해보세요

복잡한 계산이 어렵다면, 저희 계산기를 활용해보세요. 필요한 정보만 입력하면 자동으로 결과를 확인할 수 있습니다.

👉 [{{topic}} 계산기 바로가기]({{toolUrl}})

## 주의사항

{{topic}} 관련해서 자주 실수하는 부분들입니다:

1. **정보 누락**: 모든 관련 정보를 빠짐없이 입력해야 정확한 결과가 나옵니다
2. **기준일 오류**: 시작일과 종료일을 정확히 확인하세요
3. **예외 사항 미확인**: 특수한 상황이 있다면 별도로 확인이 필요합니다

## 관련 정보 더 알아보기

{{topic}}과 관련된 다른 유용한 정보도 확인해보세요:

- 📊 [관련 계산기]({{toolUrl}}) - 직접 계산해보기
- 📝 [관련 블로그 글](/{{lang}}/blog) - 더 많은 정보 확인

## 결론

{{topic}}은 정확한 정보와 계산이 중요합니다. 이 글의 내용을 참고하시고, 계산기를 활용하여 본인의 상황에 맞는 정확한 결과를 확인해보세요.
`,
  },
  en: {
    categoryMap: {
      'severance': 'Finance/Tax',
      'annual-leave': 'Finance/Tax',
      'salary': 'Finance/Tax',
      'tax': 'Finance/Tax',
      'loan': 'Finance/Loans',
      'mortgage': 'Real Estate',
      'apartment': 'Real Estate',
      'rent': 'Real Estate',
      'car': 'Lifestyle/Auto',
      'bmi': 'Health',
    },
    emojiMap: {
      'severance': '💰',
      'annual-leave': '🏖️',
      'salary': '💵',
      'tax': '🏛️',
      'loan': '💳',
      'mortgage': '🏦',
      'apartment': '🏢',
      'rent': '🏠',
      'car': '🚗',
      'bmi': '⚖️',
    },
    faqTemplates: [
      { q: 'When does {{topic}} apply?', a: '{{topic}} applies when specific conditions are met. Please refer to the article for details.' },
      { q: 'What should I watch out for when calculating {{topic}}?', a: 'Make sure to enter all required information accurately. Check for any exceptions that may apply.' },
      { q: 'What if my {{topic}} result seems incorrect?', a: 'Double-check your inputs and consider any special circumstances that might affect the calculation.' },
    ],
    contentTemplate: `
## What is {{topic}}?

{{topic}} is a topic many people are curious about. Having accurate information helps you make better decisions.

In this guide, we'll cover everything from basic concepts to calculation methods and important considerations.

## Understanding the Basics

To understand {{topic}}, you first need to know the fundamental concepts.

### Key Elements

- **First element**: The primary factor in the calculation
- **Second element**: Additional factors that affect the result
- **Third element**: Considerations for special circumstances

## How to Calculate

{{topic}} calculation follows this formula:

**Basic Formula = Base Value × Rate × Period**

### Step-by-Step Calculation

1. **Verify base value**: Confirm the foundational value for calculation
2. **Apply rate**: Apply the relevant percentage or rate
3. **Final calculation**: Combine all elements for the result

## Real Example

Let's look at an example with a $50,000 annual salary over 3 years:

- Base value: $50,000
- Period: 3 years
- **Expected result**: Use our calculator for the exact amount

## Calculate It Yourself

If manual calculation seems complex, try our calculator. Just enter the required information and get instant results.

👉 [Go to {{topic}} Calculator]({{toolUrl}})

## Important Considerations

Common mistakes to avoid with {{topic}}:

1. **Missing information**: Enter all relevant data for accurate results
2. **Date errors**: Verify start and end dates carefully
3. **Overlooking exceptions**: Check for special circumstances that may apply

## Learn More

Explore more useful information related to {{topic}}:

- 📊 [Related Calculator]({{toolUrl}}) - Calculate it yourself
- 📝 [More Blog Posts](/{{lang}}/blog) - Additional resources

## Conclusion

Accurate information and calculation are crucial for {{topic}}. Use this guide as a reference and our calculator to get precise results for your situation.
`,
  },
};

// Generate slug from topic
function generateSlug(topic, lang) {
  if (lang === 'ko') {
    // For Korean, create a transliterated version or use key terms
    const slugMap = {
      '퇴직금': 'severance-pay',
      '연차': 'annual-leave',
      '연봉': 'salary',
      '실수령액': 'take-home-pay',
      '세금': 'tax',
      '대출': 'loan',
      '모기지': 'mortgage',
      '아파트': 'apartment',
      '전세': 'jeonse',
      '월세': 'monthly-rent',
      '자동차': 'car',
      'BMI': 'bmi',
    };

    let slug = topic.toLowerCase();
    for (const [korean, english] of Object.entries(slugMap)) {
      if (topic.includes(korean)) {
        slug = english;
        break;
      }
    }

    return `${slug}-calculation-guide`;
  }

  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-guide';
}

// Detect category from topic or tool URL
function detectCategory(topic, toolUrl, lang) {
  const template = templates[lang];
  const lowerTopic = topic.toLowerCase();
  const lowerTool = toolUrl.toLowerCase();

  for (const [key, category] of Object.entries(template.categoryMap)) {
    if (lowerTopic.includes(key) || lowerTool.includes(key)) {
      return category;
    }
  }

  return lang === 'ko' ? '일반' : 'General';
}

// Detect emoji from topic or tool URL
function detectEmoji(topic, toolUrl, lang) {
  const template = templates[lang];
  const lowerTopic = topic.toLowerCase();
  const lowerTool = toolUrl.toLowerCase();

  for (const [key, emoji] of Object.entries(template.emojiMap)) {
    if (lowerTopic.includes(key) || lowerTool.includes(key)) {
      return emoji;
    }
  }

  return '📝';
}

// Generate keywords from topic
function generateKeywords(topic, lang) {
  const baseKeywords = topic.split(/\s+/).filter(w => w.length > 1);

  if (lang === 'ko') {
    return [
      ...baseKeywords,
      `${topic} 계산`,
      `${topic} 계산기`,
      `${topic} 방법`,
      `${topic} 기준`,
    ].slice(0, 6);
  }

  return [
    ...baseKeywords,
    `${topic} calculation`,
    `${topic} calculator`,
    `how to calculate ${topic}`,
  ].slice(0, 6);
}

// Generate FAQ from templates
function generateFaq(topic, lang) {
  const template = templates[lang];
  return template.faqTemplates.map(item => ({
    question: item.q.replace(/\{\{topic\}\}/g, topic),
    answer: item.a.replace(/\{\{topic\}\}/g, topic),
  }));
}

// Generate content from template
function generateContent(topic, toolUrl, lang) {
  const template = templates[lang];
  return template.contentTemplate
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{toolUrl\}\}/g, toolUrl)
    .replace(/\{\{lang\}\}/g, lang)
    .trim();
}

// Generate title
function generateTitle(topic, lang) {
  if (lang === 'ko') {
    return `${topic} 완벽 가이드 - 2026년 기준`;
  }
  return `Complete Guide to ${topic} - 2026`;
}

// Generate description
function generateDescription(topic, lang) {
  if (lang === 'ko') {
    return `${topic}의 모든 것을 알아봅니다. 계산 방법, 주의사항, 자주 묻는 질문까지 한 번에 정리했습니다.`;
  }
  return `Everything you need to know about ${topic}. Calculation methods, tips, and frequently asked questions.`;
}

// Main generator function
function generateBlogPost(input) {
  const { language: lang, topic, targetTool: toolUrl, intent } = input;

  const slug = generateSlug(topic, lang);
  const title = generateTitle(topic, lang);
  const description = generateDescription(topic, lang);
  const category = detectCategory(topic, toolUrl, lang);
  const emoji = detectEmoji(topic, toolUrl, lang);
  const keywords = generateKeywords(topic, lang);
  const faq = generateFaq(topic, lang);
  const content = generateContent(topic, toolUrl, lang);
  const publishDate = new Date().toISOString().split('T')[0];

  // Build frontmatter
  const frontmatter = `---
title: "${title}"
description: "${description}"
publishDate: "${publishDate}"
category: "${category}"
emoji: "${emoji}"
relatedTool: "${toolUrl}"
relatedPosts: []
keywords:
${keywords.map(k => `  - ${k}`).join('\n')}
faq:
${faq.map(item => `  - question: "${item.question}"
    answer: "${item.answer}"`).join('\n')}
---`;

  const markdown = `${frontmatter}

${content}
`;

  return { slug, markdown };
}

// CLI handling
function main() {
  const args = process.argv.slice(2);

  let input;

  if (args.includes('--input')) {
    const inputIndex = args.indexOf('--input');
    const inputFile = args[inputIndex + 1];

    if (!inputFile || !fs.existsSync(inputFile)) {
      console.error('Error: Input file not found');
      process.exit(1);
    }

    input = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  } else if (args.includes('--topic')) {
    const topicIndex = args.indexOf('--topic');
    const toolIndex = args.indexOf('--tool');
    const langIndex = args.indexOf('--lang');

    input = {
      language: args[langIndex + 1] || 'ko',
      topic: args[topicIndex + 1],
      targetTool: args[toolIndex + 1] || '/ko/tools',
      intent: '정보 탐색',
    };
  } else {
    console.log(`
Blog Post Generator for JudySylph

Usage:
  node scripts/generate-blog.js --input input.json
  node scripts/generate-blog.js --topic "퇴직금 계산" --tool "/ko/tools/severance-calculator" --lang ko

Input JSON format:
{
  "language": "ko",
  "topic": "퇴직금 계산 방법",
  "targetTool": "/ko/tools/severance-calculator",
  "intent": "정보 탐색 + 의사결정"
}
    `);
    process.exit(0);
  }

  if (!input.topic) {
    console.error('Error: Topic is required');
    process.exit(1);
  }

  const { slug, markdown } = generateBlogPost(input);

  // Determine output path
  const outputDir = path.join(process.cwd(), 'src', 'content', 'blog', input.language);
  const outputPath = path.join(outputDir, `${slug}.md`);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`✅ Blog post generated successfully!`);
  console.log(`📄 File: ${outputPath}`);
  console.log(`🔗 URL: /${input.language}/blog/${slug}`);
}

main();
