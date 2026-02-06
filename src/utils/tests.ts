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
  'travel': 'lifestyle',
  'mental-age': 'fun',
  'hidden-talent': 'personality',
  'ideal-type': 'love',
  'food-personality': 'fun',
  'mbti-compatibility': 'love',
  'hsp': 'personality',
  'personal-color': 'personality',
  'kkondae': 'fun',
  'alter-ego': 'personality',
  'meme-knowledge': 'fun',
  'empathy': 'personality',
  'food-persona': 'fun',
  'aura': 'personality',
  'thinking-feeling': 'personality',
  'digital-detox': 'lifestyle',
  'ai-style': 'personality',
  'eco-personality': 'lifestyle',
  'work-life-balance': 'career',
  'money-personality': 'lifestyle'
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
// New tests
import mentalAgeKo from '../content/tests/ko/mental-age.json';
import mentalAgeEn from '../content/tests/en/mental-age.json';
import hiddenTalentKo from '../content/tests/ko/hidden-talent.json';
import hiddenTalentEn from '../content/tests/en/hidden-talent.json';
import idealTypeKo from '../content/tests/ko/ideal-type.json';
import idealTypeEn from '../content/tests/en/ideal-type.json';
import foodPersonalityKo from '../content/tests/ko/food-personality.json';
import foodPersonalityEn from '../content/tests/en/food-personality.json';
import mbtiCompatibilityKo from '../content/tests/ko/mbti-compatibility.json';
import mbtiCompatibilityEn from '../content/tests/en/mbti-compatibility.json';
// New tests - 2025
import hspKo from '../content/tests/ko/hsp.json';
import hspEn from '../content/tests/en/hsp.json';
import personalColorKo from '../content/tests/ko/personal-color.json';
import personalColorEn from '../content/tests/en/personal-color.json';
import kkondaeKo from '../content/tests/ko/kkondae.json';
import kkondaeEn from '../content/tests/en/kkondae.json';
import alterEgoKo from '../content/tests/ko/alter-ego.json';
import alterEgoEn from '../content/tests/en/alter-ego.json';
// New trending tests - 2026
import memeKnowledgeKo from '../content/tests/ko/meme-knowledge.json';
import memeKnowledgeEn from '../content/tests/en/meme-knowledge.json';
import empathyKo from '../content/tests/ko/empathy.json';
import empathyEn from '../content/tests/en/empathy.json';
import foodPersonaKo from '../content/tests/ko/food-persona.json';
import foodPersonaEn from '../content/tests/en/food-persona.json';
import auraKo from '../content/tests/ko/aura.json';
import auraEn from '../content/tests/en/aura.json';
import thinkingFeelingKo from '../content/tests/ko/thinking-feeling.json';
import thinkingFeelingEn from '../content/tests/en/thinking-feeling.json';
// Trending tests - 2026
import digitalDetoxKo from '../content/tests/ko/digital-detox.json';
import digitalDetoxEn from '../content/tests/en/digital-detox.json';
import aiStyleKo from '../content/tests/ko/ai-style.json';
import aiStyleEn from '../content/tests/en/ai-style.json';
import ecoPersonalityKo from '../content/tests/ko/eco-personality.json';
import ecoPersonalityEn from '../content/tests/en/eco-personality.json';
import workLifeBalanceKo from '../content/tests/ko/work-life-balance.json';
import workLifeBalanceEn from '../content/tests/en/work-life-balance.json';
import moneyPersonalityKo from '../content/tests/ko/money-personality.json';
import moneyPersonalityEn from '../content/tests/en/money-personality.json';

const testsKo: Test[] = [animalKo, loveStyleKo, colorKo, stressKo, careerKo, mbtiKo, loveLanguageKo, learningStyleKo, spendingKo, burnoutKo, socialKo, pastLifeKo, travelKo, mentalAgeKo, hiddenTalentKo, idealTypeKo, foodPersonalityKo, mbtiCompatibilityKo, hspKo, personalColorKo, kkondaeKo, alterEgoKo, memeKnowledgeKo, empathyKo, foodPersonaKo, auraKo, thinkingFeelingKo, digitalDetoxKo, aiStyleKo, ecoPersonalityKo, workLifeBalanceKo, moneyPersonalityKo];
const testsEn: Test[] = [animalEn, loveStyleEn, colorEn, stressEn, careerEn, mbtiEn, loveLanguageEn, learningStyleEn, spendingEn, burnoutEn, socialEn, pastLifeEn, travelEn, mentalAgeEn, hiddenTalentEn, idealTypeEn, foodPersonalityEn, mbtiCompatibilityEn, hspEn, personalColorEn, kkondaeEn, alterEgoEn, memeKnowledgeEn, empathyEn, foodPersonaEn, auraEn, thinkingFeelingEn, digitalDetoxEn, aiStyleEn, ecoPersonalityEn, workLifeBalanceEn, moneyPersonalityEn];

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
