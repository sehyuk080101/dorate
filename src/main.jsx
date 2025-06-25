// React와 ReactDOM을 가져옵니다
import React from 'react';
import ReactDOM from 'react-dom/client';

// 메인 App 컴포넌트를 가져옵니다
import App from './App.jsx';

// 글로벌 CSS 스타일을 가져옵니다
import './index.css';

// React 앱을 DOM에 렌더링합니다
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode는 개발 모드에서 잠재적인 문제를 찾아내는 데 도움을 줍니다
  <React.StrictMode>
    {/* 메인 App 컴포넌트를 렌더링합니다 */}
    <App />
  </React.StrictMode>,
); 