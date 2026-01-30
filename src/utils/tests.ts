export interface Choice {
  text: string;
  scores: Record<string, number>;
}

export interface Question {
  question: string;
  choices: Choice[];
}

export interface ResultType {
  type: string;
  title: string;
  emoji: string;
  description: string;
  traits: string[];
  advice: string;
  compatibility?: {
    good: string[];
    bad: string[];
  };
}

export interface Test {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  questions: Question[];
  results: ResultType[];
}

export type TestCategory = 'personality' | 'love' | 'career' | 'lifestyle' | 'fun';

export interface TestMeta {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  questionCount: number;
  category: TestCategory;
}

// Category mapping for all tests
const testCategories: Record<string, TestCategory> = {
  'animal': 'personality',
  'love-style': 'love',
  'color': 'personality',
  'stress': 'lifestyle',
  'career': 'career',
  'mbti': 'personality',
  'love-language': 'love',
  'learning-style': 'career',
  'spending': 'lifestyle',
  'burnout': 'career',
  'social': 'personality',
  'past-life': 'fun',
  'travel': 'lifestyle'
};

export const categoryLabels = {
  ko: {
    all: '전체',
    personality: '성격',
    love: '연애',
    career: '직업',
    lifestyle: '라이프',
    fun: '재미'
  },
  en: {
    all: 'All',
    personality: 'Personality',
    love: 'Love',
    career: 'Career',
    lifestyle: 'Lifestyle',
    fun: 'Fun'
  }
};

// Import all test data
import animalKo from '../content/tests/ko/animal.json';
import animalEn from '../content/tests/en/animal.json';
import loveStyleKo from '../content/tests/ko/love-style.json';
import loveStyleEn from '../content/tests/en/love-style.json';
import colorKo from '../content/tests/ko/color.json';
import colorEn from '../content/tests/en/color.json';
import stressKo from '../content/tests/ko/stress.json';
import stressEn from '../content/tests/en/stress.json';
import careerKo from '../content/tests/ko/career.json';
import careerEn from '../content/tests/en/career.json';
// New tests
import mbtiKo from '../content/tests/ko/mbti.json';
import mbtiEn from '../content/tests/en/mbti.json';
import loveLanguageKo from '../content/tests/ko/love-language.json';
import loveLanguageEn from '../content/tests/en/love-language.json';
import learningStyleKo from '../content/tests/ko/learning-style.json';
import learningStyleEn from '../content/tests/en/learning-style.json';
import spendingKo from '../content/tests/ko/spending.json';
import spendingEn from '../content/tests/en/spending.json';
import burnoutKo from '../content/tests/ko/burnout.json';
import burnoutEn from '../content/tests/en/burnout.json';
import socialKo from '../content/tests/ko/social.json';
import socialEn from '../content/tests/en/social.json';
import pastLifeKo from '../content/tests/ko/past-life.json';
import pastLifeEn from '../content/tests/en/past-life.json';
import travelKo from '../content/tests/ko/travel.json';
import travelEn from '../content/tests/en/travel.json';

const testsKo: Test[] = [animalKo, loveStyleKo, colorKo, stressKo, careerKo, mbtiKo, loveLanguageKo, learningStyleKo, spendingKo, burnoutKo, socialKo, pastLifeKo, travelKo];
const testsEn: Test[] = [animalEn, loveStyleEn, colorEn, stressEn, careerEn, mbtiEn, loveLanguageEn, learningStyleEn, spendingEn, burnoutEn, socialEn, pastLifeEn, travelEn];

export function getAllTests(lang: string): Test[] {
  return lang === 'ko' ? testsKo : testsEn;
}

export function getTest(slug: string, lang: string): Test | undefined {
  const tests = getAllTests(lang);
  return tests.find(t => t.slug === slug);
}

export function getTestMeta(lang: string): TestMeta[] {
  const tests = getAllTests(lang);
  return tests.map(t => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    emoji: t.emoji,
    questionCount: t.questions.length,
    category: testCategories[t.slug] || 'personality'
  }));
}

export function getTestsByCategory(lang: string, category: TestCategory): TestMeta[] {
  return getTestMeta(lang).filter(t => t.category === category);
}

export function getRecommendedTests(lang: string, currentSlug: string, limit: number = 3): TestMeta[] {
  const currentTest = getTestMeta(lang).find(t => t.slug === currentSlug);
  if (!currentTest) return getTestMeta(lang).slice(0, limit);

  const allTests = getTestMeta(lang).filter(t => t.slug !== currentSlug);

  // Prioritize same category, then random
  const sameCategory = allTests.filter(t => t.category === currentTest.category);
  const otherCategory = allTests.filter(t => t.category !== currentTest.category);

  const recommended = [...sameCategory, ...otherCategory].slice(0, limit);
  return recommended;
}

export function calculateResult(test: Test, scores: Record<string, number>): ResultType {
  // Find the result type with the highest score
  let maxType = '';
  let maxScore = -Infinity;

  for (const type in scores) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      maxType = type;
    }
  }

  // Find and return the matching result
  const result = test.results.find(r => r.type === maxType);
  return result || test.results[0];
}

export function getResultByType(test: Test, type: string): ResultType | undefined {
  return test.results.find(r => r.type === type);
}

export function getAllResultTypes(test: Test): string[] {
  return test.results.map(r => r.type);
}
