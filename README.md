# 🛍️ MUSINSA AI LENS (무신사 AI 렌즈)

**"사용자의 스타일을 분석하고, 가장 어울리는 무신사 아이템을 찾아주는 AI 패션 어드바이저"** 


<img width="424" height="650" alt="스크린샷 2026-01-22 오전 2 21 24" src="https://github.com/user-attachments/assets/d8c29c82-54fb-469c-b13b-595f30b5ae20" />
<img width="424" height="553" alt="스크린샷 2026-01-22 오전 2 11 05" src="https://github.com/user-attachments/assets/00014d90-6b0e-4363-bd86-9a23afcb34d6" />


## 🔗 배포 링크 (Demo)
👉 **[서비스 바로가기 (Vercel)](https://musinsa-ai-lens-sea.vercel.app)**

---

## 💡 프로젝트 소개 (Background)

이 프로젝트는 **초개인화된 커머스 경험(Hyper-Personalization)** 을 제공하기 위해 기획되었습니다.
단순히 상품을 나열하는 것을 넘어, 사용자의 **사진 한 장**으로 스타일, 체형, 퍼스널 컬러를 분석하고 그에 맞는 무신사 상품을 제안합니다.

특히 이번 프로젝트는 제가 **새로운 기술 스택(React, Next.js)** 을 **AI 도구(Cursor, GPT-4o)** 를 활용해 얼마나 빠르게 습득하고 실무 레벨의 결과물을 만들어낼 수 있는지 증명하는 도전이기도 합니다.
동시에 새로운 기술 스택으로 저의 기술 스택과 실무 영역을 넓히는 도전입니다.

## ✨ 주요 기능 (Key Features)

* **📸 AI 스타일 분석:** 업로드된 데일리룩 사진을 Vision AI가 분석하여 스타일(미니멀, 스트릿 등)을 정의합니다.
* **🎨 퍼스널 컬러 & 체형 진단:** 이미지 기반으로 사용자의 퍼스널 컬러와 체형 특징을 추론하여 UI 뱃지로 시각화합니다.
* **🛍️ AI 커머스 매칭:** 분석된 스타일에 어울리는 아이템을 구체적인 상품명/가격과 함께 추천합니다.
* **🔗 무신사 검색 연동:** 추천 아이템 클릭 시, 정확한 검색 키워드로 인코딩된 무신사 스토어 페이지로 즉시 연결됩니다.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Frontend:** `Next.js 14 (App Router)`, `React`, `TypeScript`
* **Styling:** `Tailwind CSS` (Musinsa Black & White Design System)
* **AI & Logic:** `OpenAI API (GPT-4o-mini)`, `Cursor (AI IDE)`
* **Deployment:** `Vercel`

---

## 🚀 기술적 도전 및 문제 해결 (Troubleshooting)

### 외부 링크 리다이렉트 최적화 (UX 개선)
* **문제:** 추천 상품 클릭 시 무신사 검색 페이지로 이동하는 과정에서 2~3회의 리다이렉트(화면 깜빡임) 발생.
* **원인:** `search/goods` 등 구형 URL 사용 시 모바일/PC 분기 처리 및 내부 라우팅으로 인한 지연.
* **해결:** 네트워크 탭 분석을 통해 최종 목적지 URL인 `search/about`을 파악하고, `encodeURIComponent`를 적용하여 **Zero-Redirect** 연결 구현.




> *"새로운 기술을 배우는 것을 두려워하지 않으며, AI를 도구로 활용해 사용자에게 가치를 전달하는 속도를 높입니다."*
