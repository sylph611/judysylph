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

export interface TestMeta {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  questionCount: number;
}

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

const testsKo: Test[] = [animalKo, loveStyleKo, colorKo, stressKo, careerKo];
const testsEn: Test[] = [animalEn, loveStyleEn, colorEn, stressEn, careerEn];

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
    questionCount: t.questions.length
  }));
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
