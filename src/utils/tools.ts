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

export function generateToolBreadcrumbSchema(tool: Tool, lang: string, siteUrl: string) {
  const toolsLabel = lang === 'ko' ? '도구' : 'Tools';
  const homeLabel = lang === 'ko' ? '홈' : 'Home';

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeLabel,
        "item": `${siteUrl}/${lang}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": toolsLabel,
        "item": `${siteUrl}/${lang}/tools`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.title,
        "item": `${siteUrl}/${lang}/tools/${tool.slug}`
      }
    ]
  };
}

export function generateToolHowToSchema(
  tool: Tool,
  lang: string,
  siteUrl: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": tool.title,
    "description": tool.description,
    "image": `${siteUrl}/og/default.svg`,
    "totalTime": "PT2M",
    "tool": {
      "@type": "HowToTool",
      "name": lang === 'ko' ? '웹 브라우저' : 'Web Browser'
    },
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": `${siteUrl}/${lang}/tools/${tool.slug}#step${index + 1}`
    }))
  };
}

// Pre-defined HowTo steps for common calculator types
export const calculatorSteps = {
  ko: {
    financial: [
      { name: "정보 입력", text: "필요한 금액, 날짜, 비율 등의 정보를 입력합니다." },
      { name: "계산 실행", text: "계산하기 버튼을 클릭하여 결과를 확인합니다." },
      { name: "결과 확인", text: "계산 결과와 상세 내역을 확인합니다." },
      { name: "결과 저장/공유", text: "필요시 결과를 이미지로 저장하거나 공유합니다." }
    ],
    converter: [
      { name: "변환할 값 입력", text: "변환하고자 하는 값을 입력합니다." },
      { name: "단위 선택", text: "변환할 단위를 선택합니다." },
      { name: "결과 확인", text: "자동으로 변환된 결과를 확인합니다." }
    ],
    date: [
      { name: "날짜 입력", text: "계산에 필요한 날짜를 입력합니다." },
      { name: "계산 실행", text: "계산하기 버튼을 클릭합니다." },
      { name: "결과 확인", text: "계산된 결과를 확인합니다." }
    ],
    health: [
      { name: "신체 정보 입력", text: "키, 체중 등 필요한 신체 정보를 입력합니다." },
      { name: "계산 실행", text: "계산하기 버튼을 클릭합니다." },
      { name: "결과 분석", text: "결과와 권장 사항을 확인합니다." }
    ]
  },
  en: {
    financial: [
      { name: "Enter Information", text: "Enter the required amounts, dates, rates, and other information." },
      { name: "Calculate", text: "Click the Calculate button to see the results." },
      { name: "Review Results", text: "Review the calculation results and detailed breakdown." },
      { name: "Save/Share Results", text: "Save the results as an image or share them if needed." }
    ],
    converter: [
      { name: "Enter Value", text: "Enter the value you want to convert." },
      { name: "Select Units", text: "Select the units for conversion." },
      { name: "View Results", text: "View the automatically converted results." }
    ],
    date: [
      { name: "Enter Date", text: "Enter the required date for calculation." },
      { name: "Calculate", text: "Click the Calculate button." },
      { name: "View Results", text: "View the calculated results." }
    ],
    health: [
      { name: "Enter Body Info", text: "Enter required body information like height and weight." },
      { name: "Calculate", text: "Click the Calculate button." },
      { name: "Analyze Results", text: "Review the results and recommendations." }
    ]
  }
};

// Map tool slugs to their HowTo step type
export function getToolStepType(slug: string): 'financial' | 'converter' | 'date' | 'health' {
  const financialTools = [
    'severance-calculator', 'annual-leave-calculator', 'korea-salary-calculator',
    'salary-calculator', 'unemployment-benefits', 'gift-inheritance-tax',
    'mortgage-calculator', 'apartment-affordability', 'car-affordability',
    'salary-percentile', 'loan-refinance', 'jeonse-vs-wolse', 'rent-vs-buy',
    'mortgage-comparison', 'loan-comparison', 'car-buy-vs-lease', 'jeonse-loan',
    'state-tax-calculator'
  ];
  const converterTools = ['unit-converter', 'color-converter', 'json-formatter'];
  const dateTools = ['age-calculator', 'dday-calculator', 'timer'];
  const healthTools = ['bmi-calculator'];

  if (financialTools.includes(slug)) return 'financial';
  if (converterTools.includes(slug)) return 'converter';
  if (dateTools.includes(slug)) return 'date';
  if (healthTools.includes(slug)) return 'health';
  return 'financial'; // default
}
