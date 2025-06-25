# DoRate - AI 기반 할 일 관리 앱

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-green?logo=openai" alt="OpenAI" />
</div>

<br>

DoRate는 AI 기반 개인 생산성 분석과 스마트 할 일 추천 기능을 제공하는 현대적인 할 일 관리 앱입니다. GPT-4o를 활용하여 사용자의 작업 패턴을 분석하고 개인화된 피드백과 추천을 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 할 일 관리
- **할 일 CRUD**: 추가, 수정, 삭제, 완료/미완료 토글
- **카테고리 분류**: 업무, 개인, 학습, 건강
- **우선순위 설정**: 높음, 보통, 낮음 (색상 구분)
- **마감일 관리**: 날짜 설정, 기한 초과 알림
- **태그 & 댓글**: 할 일에 태그 추가 및 댓글 작성
- **드래그 앤 드롭**: 할 일 순서 변경

### 🤖 AI 인사이트
- **개인화된 피드백**: 하루/주/월 단위 성과 분석
- **스마트 추천**: 완료 패턴 기반 할 일 추천
- **생산성 분석**: 시간대별, 요일별 완료 패턴 분석
- **개선점 제시**: 실패한 할 일에 대한 구체적 조언

### 📊 대시보드 & 분석
- **실시간 통계**: 완료율, 카테고리별 분포
- **진행률 시각화**: 프로그레스 바와 차트
- **필터링**: 상태별, 날짜별 할 일 필터
- **검색 기능**: 제목, 카테고리 기반 실시간 검색

### ⚙️ 사용자 설정
- **다크/라이트 모드**: 테마 전환
- **반응형 디자인**: 모바일/데스크톱 최적화
- **데이터 관리**: 초기화 및 백업

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- OpenAI API 키

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd dorate
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
프로젝트 루트에 `.env` 파일을 생성하고 OpenAI API 키를 설정하세요:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:5173
```

### 빌드
```bash
npm run build
```

## 🛠️ 기술 스택

### Frontend
- **React 18.2.0** - 사용자 인터페이스
- **Vite 5.0.0** - 빌드 도구 및 개발 서버
- **Tailwind CSS 3.3.0** - 스타일링
- **Lucide React** - 아이콘 라이브러리

### AI & API
- **OpenAI GPT-4o** - AI 피드백 및 추천
- **OpenAI JavaScript SDK** - API 통신

### 상태 관리 & 데이터
- **React Hooks** - 상태 관리
- **LocalStorage** - 데이터 영속성
- **URL Hash Routing** - 페이지 라우팅

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── AddTodo.jsx     # 할 일 추가 컴포넌트
│   ├── AIFeedback.jsx  # AI 피드백 컴포넌트
│   ├── Dashboard.jsx   # 대시보드 컴포넌트
│   ├── Header.jsx      # 헤더 컴포넌트
│   ├── Modal.jsx       # 모달 컴포넌트
│   ├── Sidebar.jsx     # 사이드바 컴포넌트
│   ├── StatsCard.jsx   # 통계 카드 컴포넌트
│   ├── TaskView.jsx    # 할 일 목록 뷰
│   ├── TodoItem.jsx    # 개별 할 일 아이템
│   └── TodoList.jsx    # 할 일 목록 컴포넌트
├── hooks/              # 커스텀 훅
│   └── useTodos.js     # 할 일 관리 로직
├── utils/              # 유틸리티 함수
│   └── aiService.js    # AI 서비스 로직
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx            # 앱 진입점
└── index.css           # 글로벌 스타일
```

## 🎨 주요 기능 상세

### AI 피드백 시스템
- **기간별 분석**: 하루, 일주일, 한 달 단위 성과 분석
- **패턴 인식**: 완료 시간대, 요일별 패턴 분석
- **개인화된 조언**: 사용자 특성에 맞는 구체적 개선점 제시
- **자연어 피드백**: GPT-4o 기반 자연스러운 한국어 피드백

### 스마트 추천 시스템
- **패턴 기반 추천**: 과거 완료 패턴 분석
- **최적 스케줄링**: 개인 생산성 패턴에 맞는 시간 추천
- **카테고리별 추천**: 업무/개인/학습/건강 분야별 맞춤 추천
- **원클릭 추가**: 추천된 할 일을 바로 목록에 추가

### 데이터 시각화
- **실시간 통계**: 완료율, 진행 상황 실시간 업데이트
- **색상 코딩**: 우선순위, 카테고리별 색상 구분
- **상태 표시**: 기한 초과, 오늘 마감 등 시각적 알림

## 🔧 환경 변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `VITE_OPENAI_API_KEY` | OpenAI API 키 | ✅ |

## 📱 반응형 디자인

- **모바일 최적화**: 터치 친화적 인터페이스
- **태블릿 지원**: 중간 화면 크기 최적화
- **데스크톱**: 전체 기능 활용 가능한 레이아웃
- **다크 모드**: 눈의 피로를 줄이는 어두운 테마

## 🔒 보안

- **API 키 보안**: 환경 변수를 통한 API 키 관리
- **로컬 데이터**: 브라우저 로컬 스토리지 사용
- **클라이언트 사이드**: 모든 데이터는 사용자 기기에 저장

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

- [OpenAI](https://openai.com/) - GPT-4o API 제공
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링 프레임워크
- [Lucide](https://lucide.dev/) - 아이콘 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구

## 📞 지원

문제가 있거나 기능 요청이 있으시면 [Issues](../../issues)를 통해 알려주세요.

---

<div align="center">
  <strong>DoRate로 더 스마트한 생산성을 경험하세요! 🚀</strong>
</div> 