import OpenAI from 'openai';

// OpenAI 클라이언트를 초기화합니다
// 환경 변수에서 API 키를 가져와서 설정합니다
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // 환경 변수에서 API 키 가져오기
  dangerouslyAllowBrowser: true, // 브라우저에서 직접 OpenAI API 호출 허용
});

// 기존 로컬 분석 코드는 제거되고, OpenAI GPT-4o API를 사용하여 피드백을 생성합니다.

// 우선순위를 한글로 변환하는 함수
function getPriorityLabel(priority) {
  if (priority === 'high') return '높음';
  if (priority === 'medium') return '보통';
  return '낮음';
}

// 카테고리를 한글로 변환하는 함수
function getCategoryLabel(cat) {
  if (cat === 'Work') return '업무';
  if (cat === 'Personal') return '개인';
  if (cat === 'Learning') return '학습';
  if (cat === 'Health') return '건강';
  return cat;
}

// 할 일 목록의 카테고리와 우선순위를 한글로 변환하는 함수
function translateTaskCategories(tasks) {
  return tasks.map(task => ({
    ...task,
    category: getCategoryLabel(task.category), // 카테고리를 한글로 변환
    priority: getPriorityLabel(task.priority), // 우선순위를 한글로 변환
  }));
}

// AI 피드백을 생성하는 함수
export const generateAIFeedback = async ({
  period, // 분석 기간 ('day' | 'week' | 'month')
  completedTasks, // 완료된 할 일 목록
  failedTasks, // 실패한 할 일 목록
  successRate, // 성공률
  allTasksInPeriod, // 해당 기간의 모든 할 일 목록
}) => {
  // 기간을 한글로 변환
  const periodLabel = period === 'day' ? '오늘 하루' : period === 'week' ? '이번 주' : '이번 달';
  
  // 카테고리와 우선순위를 한글로 변환
  const completedTasksKo = translateTaskCategories(completedTasks);
  const failedTasksKo = translateTaskCategories(failedTasks);
  
  // 전체 할 일 수와 미완료 할 일들을 계산
  const totalTasks = allTasksInPeriod ? allTasksInPeriod.length : completedTasks.length + failedTasks.length;
  const pendingTasks = allTasksInPeriod ? allTasksInPeriod.filter(todo => !todo.completed) : [];
  const pendingTasksWithDeadline = pendingTasks.filter(todo => todo.deadline);
  const pendingTasksWithoutDeadline = pendingTasks.filter(todo => !todo.deadline);
  
  // GPT에게 전달할 프롬프트를 구성합니다
  const prompt = `위 정보를 바탕으로 ${periodLabel}의 성과에 대한 피드백을 제공해주세요:

현재 상황:
- 전체 할 일: ${totalTasks}개
- 완료된 할 일: ${completedTasks.length}개
- 실패한 할 일: ${failedTasks.length}개
- 미완료된 할 일 (기한 있음): ${pendingTasksWithDeadline.length}개
- 미완료된 할 일 (기한 없음): ${pendingTasksWithoutDeadline.length}개
- 성공률: ${successRate}%

피드백 요청사항:
- ${periodLabel}의 성과에 대한 현실적이고 정중한 평가
- 성공한 할 일들의 패턴 분석
- 실패한 할 일들의 개선점 제시
- 미완료된 할 일들에 대한 조언 (기한이 있는 것과 없는 것 구분)
- 내일을 위한 구체적인 조언 1-2가지
- 5-7문장의 자연스러운 한국어로 작성
- 너무 짧거나 의미가 모호한 항목(예: a, ㅇㅇ, ㅁ 등)은 분석에서 제외

완료한 일: ${JSON.stringify(completedTasksKo, null, 2)}
실패한 일: ${JSON.stringify(failedTasksKo, null, 2)}

위 기준을 반드시 지켜서 자연스러운 문장으로만 피드백을 작성해 주세요. JSON, 코드블록, 인삿말, 불필요한 설명 없이 본문만 반환하세요.`;

  // OpenAI GPT-4o API를 호출하여 피드백을 생성합니다
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o', // 사용할 AI 모델
    messages: [
      { role: 'user', content: prompt }, // 사용자 메시지로 프롬프트 전달
    ],
    temperature: 0.7, // 창의성 수준 (0.0: 매우 일관적, 1.0: 매우 창의적)
    max_tokens: 500, // 최대 토큰 수 제한
  });
  
  // AI 응답에서 내용을 추출합니다
  const content = completion.choices[0].message?.content || '';
  
  // 자연어 피드백만 반환합니다
  return content;
};

// 생산성 팁을 제공하는 함수 (현재는 사용되지 않음)
export const getProductivityTips = () => {
  const tips = [
    'Start your day by completing your most important task first.',
    'Use the 2-minute rule: if it takes less than 2 minutes, do it now.',
    'Batch similar tasks together to maintain focus and efficiency.',
    'Set specific deadlines for tasks, even if they don\'t have natural ones.',
    'Review and adjust your priorities weekly to stay aligned with your goals.',
    'Take regular breaks to maintain high performance throughout the day.',
    'Celebrate small wins to maintain motivation and positive momentum.',
  ];
  
  // 팁을 랜덤하게 섞어서 3개만 반환합니다
  return tips.sort(() => 0.5 - Math.random()).slice(0, 3);
};

// 마크다운 코드 블록에서 JSON을 추출하는 함수
// GPT가 JSON을 마크다운 코드 블록으로 감싸서 반환할 때 사용합니다
function extractJSONFromMarkdown(content) {
  // ```json ... ``` 패턴을 제거합니다
  let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  
  // 앞뒤 공백을 제거합니다
  cleaned = cleaned.trim();
  
  // JSON이 아닌 경우 원본을 반환합니다
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    return content;
  }
  
  return cleaned;
}

// AI 할 일 추천을 생성하는 함수
export const generateTaskRecommendations = async (todos) => {
  // 현재 날짜 정보를 가져옵니다
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  // 모든 할 일을 분석합니다 (완료된 것과 미완료된 것 모두)
  const allTasks = todos;
  const completedTasks = todos.filter(todo => 
    todo.completed && todo.completedAt
  );
  const pendingTasks = todos.filter(todo => !todo.completed);
  
  // 성공률을 계산합니다
  const totalTasks = allTasks.length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // 완료된 할 일이 없으면 일반적인 추천을 제공합니다
  if (completedTasks.length === 0) {
    const generalPrompt = `사용자가 아직 완료된 할 일이 없습니다. 
현재 ${totalTasks}개의 할 일이 있으며, 성공률은 ${successRate}%입니다.

일반적으로 생산성을 높이는 할 일 3개를 추천해주세요.

현재 날짜: ${currentYear}년 ${currentMonth}월 ${currentDay}일 (${currentDate})

중요: 추천 날짜는 반드시 현재 날짜(${currentDate}) 이후여야 합니다.
- 오늘 이후의 날짜만 추천해주세요
- 내일, 모레, 이번 주 내, 다음 주 등의 날짜를 사용하세요

형식: JSON으로 반환
{
  "recommendations": [
    {
      "title": "할 일 제목",
      "reason": "추천 이유",
      "suggestedDate": "YYYY-MM-DD",
      "suggestedTime": "HH:MM",
      "category": "카테고리"
    }
  ]
}

실용적이고 시작하기 쉬운 할 일을 추천해주세요.`;

    // OpenAI API를 호출하여 일반적인 추천을 생성합니다
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: generalPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });
    
    const content = completion.choices[0].message?.content || '';
    
    try {
      // 마크다운 코드 블록에서 JSON을 추출하고 파싱합니다
      const cleanedContent = extractJSONFromMarkdown(content);
      const parsed = JSON.parse(cleanedContent);
      return parsed.recommendations || [];
    } catch (error) {
      // JSON 파싱 실패 시 오류를 출력하고 빈 배열을 반환합니다
      console.error('Failed to parse AI recommendations:', error);
      console.error('Raw content:', content);
      return [];
    }
  }
  
  // 완료된 할 일이 있는 경우, 패턴을 분석하여 개인화된 추천을 생성합니다
  
  // 요일별 완료 패턴을 분석합니다
  const dayPatterns = {};
  const categoryPatterns = {};
  const timePatterns = {};
  
  completedTasks.forEach(task => {
    if (task.completedAt) {
      const day = task.completedAt.getDay(); // 0: 일요일, 1: 월요일, ...
      const hour = task.completedAt.getHours(); // 0-23
      dayPatterns[day] = (dayPatterns[day] || 0) + 1;
      timePatterns[hour] = (timePatterns[hour] || 0) + 1;
    }
    if (task.category) {
      categoryPatterns[task.category] = (categoryPatterns[task.category] || 0) + 1;
    }
  });
  
  // 가장 성공률이 높은 패턴 찾기 (초기값 제공)
  const bestDay = Object.keys(dayPatterns).length > 0 
    ? Object.keys(dayPatterns).reduce((a, b) => dayPatterns[a] > dayPatterns[b] ? a : b)
    : '1'; // 월요일 기본값
  
  const bestHour = Object.keys(timePatterns).length > 0
    ? Object.keys(timePatterns).reduce((a, b) => timePatterns[a] > timePatterns[b] ? a : b)
    : '9'; // 오전 9시 기본값
  
  const bestCategory = Object.keys(categoryPatterns).length > 0
    ? Object.keys(categoryPatterns).reduce((a, b) => categoryPatterns[a] > categoryPatterns[b] ? a : b)
    : 'Work'; // 업무 기본값
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const categoryLabels = {
    'Work': '업무',
    'Personal': '개인',
    'Learning': '학습', 
    'Health': '건강'
  };
  
  const prompt = `사용자의 할 일 완료 패턴을 분석한 결과입니다:

현재 날짜: ${currentYear}년 ${currentMonth}월 ${currentDay}일 (${currentDate})

전체 할 일: ${totalTasks}개
완료된 할 일: ${completedTasks.length}개
미완료된 할 일: ${pendingTasks.length}개
성공률: ${successRate}%

- 가장 성공률이 높은 요일: ${dayNames[bestDay]}요일 (${dayPatterns[bestDay] || 0}회 완료)
- 가장 집중도가 높은 시간대: ${bestHour}시 (${timePatterns[bestHour] || 0}회 완료)
- 가장 자주 완료하는 카테고리: ${categoryLabels[bestCategory] || bestCategory} (${categoryPatterns[bestCategory] || 0}회 완료)

이 패턴을 바탕으로 사용자에게 추천할 할 일 3개를 제안해주세요. 각 추천에는:
1. 구체적인 할 일 제목
2. 추천 이유 (어떤 패턴 기반인지)
3. 추천하는 날짜/시간

중요: 추천 날짜는 반드시 현재 날짜(${currentDate}) 이후여야 합니다.
- 오늘 이후의 날짜만 추천해주세요
- 내일, 모레, 이번 주 내, 다음 주 등의 날짜를 사용하세요

형식: JSON으로 반환
{
  "recommendations": [
    {
      "title": "할 일 제목",
      "reason": "추천 이유",
      "suggestedDate": "YYYY-MM-DD",
      "suggestedTime": "HH:MM",
      "category": "카테고리"
    }
  ]
}

자연스럽고 실용적인 할 일을 추천해주세요.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });
  
  const content = completion.choices[0].message?.content || '';
  
  try {
    const cleanedContent = extractJSONFromMarkdown(content);
    const parsed = JSON.parse(cleanedContent);
    return parsed.recommendations || [];
  } catch (error) {
    console.error('Failed to parse AI recommendations:', error);
    console.error('Raw content:', content);
    return [];
  }
};