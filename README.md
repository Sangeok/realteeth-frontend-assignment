# RealTeeth 프론트엔드 과제 (Weather App) 

공공데이터 포털 기상청 API를 활용한 현재 위치 기반 날씨 조회 앱입니다.
브라우저 Geolocation으로 현재 위치를 감지하고, 대한민국 행정구역 검색과 즐겨찾기를 통해 여러 지역의 날씨를 한눈에 확인할 수 있습니다.
첫 진입 시 WeatherDashboard와 즐겨찾기 카드에 스켈레톤을 사용해 레이아웃 점프를 줄이고, 로컬 ErrorBoundary로 오류를 격리합니다.

---

## 주요 기능

### 안정적인 첫 진입 UX
- 현재 위치 확인 중 `WeatherDashboard` 영역을 스켈레톤으로 선점하여 CLS를 최소화
- 날씨 응답 대기 중에도 실제 카드 레이아웃과 유사한 스켈레톤 유지
- 위치 상태 메시지 영역 높이를 고정하여 헤더 제목 점프 방지
- 즐겨찾기 카드 로딩/오류를 카드 단위로 격리하여 목록 전체가 흔들리지 않음

### 현재 위치 기반 날씨
- 앱 첫 진입 시 브라우저 Geolocation API로 현재 위치를 자동 감지
- 감지된 좌표를 기상청 격자 좌표로 변환하여 날씨 정보 조회
- 위도/경도를 VWORLD 역지오코딩 API로 도로명 주소로 변환하여 표시

### 날씨 정보 표시
- 현재 기온 (기상청 초단기실황)
- 당일 최저/최고 기온
- 시간대별 기온 예보 (기상청 단기예보)

### 장소 검색
- 시/도·시/군/구·읍/면/동 단위 통합 검색
- 디바운싱 적용으로 입력 중 실시간 검색
- `korea_districts.json` 기반 클라이언트 사이드 검색 (서버 요청 없음)

### 즐겨찾기
- 검색한 장소를 즐겨찾기에 추가/삭제 (최대 6개)
- 즐겨찾기 장소에 별칭(alias) 편집 기능
- 즐겨찾기 카드: 현재 기온, 최저/최고 기온 표시
- 카드 클릭 시 지역 상세 페이지(`/district/[id]`)로 이동
- localStorage를 활용한 즐겨찾기 장소 영속 저장

---

## 기술 스택

| 범주 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js | 16.1.6 |
| UI 라이브러리 | React | 19.2.3 |
| 언어 | TypeScript | 5 |
| 스타일링 | Tailwind CSS | 4 |
| 서버 상태 | TanStack Query | 5.90 |
| 클라이언트 상태 | Zustand | 5 |
| 에러 경계 | react-error-boundary | 6.1.1 |
| 스키마 검증 | Zod | 4 |
| 아이콘 | Lucide React | 0.576 |

---

## 기술적 의사결정

### 확장성과 유지보수성을 고려한 FSD (Feature-Sliced Design) 아키텍처 도입
단순한 컴포넌트 기반 폴더 구조를 넘어, 비즈니스 로직과 UI 컴포넌트의 결합도를 낮추기 위해 FSD 패턴을 도입했습니다. 
레이어 간 의존성 방향을 단방향(`shared → entities → features → widgets → pages`)으로 강제함으로써, 특정 기능(예: 즐겨찾기, 장소 검색)을 추가하거나 수정할 때 다른 도메인에 미치는 사이드이펙트를 원천 차단했습니다. 이는 추후 앱이 확장되더라도 예측 가능한 코드베이스를 유지할 수 있게 해줍니다.

### 로딩 UX 안정화 및 장애 격리 (Skeleton + Local ErrorBoundary)
날씨 앱의 특성상 `Geolocation 감지`와 `외부 API(기상청, 역지오코딩)` 통신이 연쇄적으로 발생하여 **초기 로딩 지연이 필연적으로 발생**합니다. 이를 처리하기 위해 다음 두 가지를 중점적으로 개선했습니다.

1. **Skeleton UI로 CLS(Cumulative Layout Shift) 최소화 및 체감 속도 향상**
   홈 첫 진입 시 `WeatherDashboard`나 즐겨찾기가 단순 스피너 후 튀어나오는 현상을 방지하고자, 최종 레이아웃과 동일한 높이/형태의 스켈레톤으로 공간을 먼저 선점했습니다. 이는 레이아웃 점프를 막을 뿐만 아니라, 사용자의 인지적 대기 시간을 줄여줍니다.

2. **선언적 비동기 처리 및 ErrorBoundary를 통한 장애 격리**
   컴포넌트 내부에 `if (isLoading)` / `if (isError)` 같은 선형적인 분기 처리를 두는 대신, `Suspense`와 `react-error-boundary`를 조합해 비동기 상태 처리를 컴포넌트 외부로 위임했습니다. 
   특히 공공데이터 API의 간헐적 오류에 대비해 대시보드와 각 즐겨찾기 카드를 독립된 에러 바운더리로 감쌌습니다. 특정 지역의 조회가 실패하더라도 전체 앱이 크래시되는 대신 **해당 카드에만 Fallback UI와 재시도 버튼이 노출**되어 앱의 안정성(Resilience)을 크게 높였습니다.

### TanStack Query 기반의 효율적인 서버 상태 및 캐싱 관리
단순한 데이터 페칭을 넘어 서버 상태(Server State)의 라이프사이클을 세밀하게 제어하기 위해 TanStack Query를 활용했습니다.
메인 날씨 조회에는 `useSuspenseQuery`를 적용해 React Suspense와 매끄럽게 연동되도록 구성했으며, `QueryClient` 전역 설정(`gcTime: 5분`, `refetchOnWindowFocus: false` 등)을 기상청 API 갱신 주기에 맞춰 최적화했습니다. 불필요한 중복 네트워크 요청을 줄이고, 사용자에게 가장 최신의 날씨 데이터를 빠르게 제공합니다.

### 관심사 분리를 통한 클라이언트 상태 관리 (Zustand)
서버 데이터(날씨)와 클라이언트 데이터(즐겨찾기 목록)의 상태 관리 영역을 명확하게 분리하여 각 도구가 본연의 역할에 충실하도록 설계했습니다. 
서버와 동기화가 필요한 데이터는 TanStack Query에 위임하고, 사용자의 로컬 환경에 종속적인 '즐겨찾기 목록과 별칭(Alias)' 데이터는 Zustand와 `persist` 미들웨어를 결합해 구현했습니다. 이를 통해 상태 관리의 복잡도를 낮추고, 새로고침 시에도 데이터가 영속적으로 유지되도록 UX를 향상시켰습니다.

### 외부 API 응답을 신뢰하지 않는 방어적 프로그래밍 (Zod 런타임 스키마 검증)
TypeScript의 정적 타입 검사만으로는 런타임에 발생하는 기상청 API 등 외부 데이터의 구조 변경이나 누락을 막을 수 없습니다. 
따라서 Zod를 도입해 API 계층에서 데이터 페칭 직후 응답 스키마를 검증(Parsing)하도록 파이프라인을 구축했습니다. 예상치 못한 외부 불안정 요소나 응답 장애 시, 잘못된 데이터가 UI 레이어까지 전파되어 렌더링 에러를 발생시키는 것을 미연에 방지합니다.

### 끊김 없는 UX를 위한 클라이언트 사이드 인메모리 검색 지원
대한민국 행정구역 정보(`korea_districts.json`)는 데이터 자체의 변경 빈도가 매우 낮고 크기가 제한적이라는 도메인 특성이 있습니다. 
이를 API 호출 방식이 아닌 클라이언트 로컬 메모리에 적재하여 처리하는 방식을 택했습니다. 디바운싱(Debouncing) 기법과 결합하여, 사용자가 타이핑하는 즉시 네트워크 지연(Latency) 없이 부드러운 실시간 검색 결과를 제공합니다.

---

## FSD 아키텍처 구조

```
fsd/
├── shared/        — 도메인에 무관한 범용 코드
│   ├── api/       — API 클라이언트
│   ├── config/    — 상수, 라우트 정의
│   ├── lib/       — 범용 유틸리티
│   ├── model/     — 범용 훅
│   └── ui/        — 범용 UI 컴포넌트
│
├── entities/      — 도메인 모델
│   ├── district/  — 행정구역 타입, 파싱, 검색, 격자 변환
│   └── weather/   — 날씨 타입, 파싱, 쿼리, WeatherCard UI
│
├── features/      — 사용자 시나리오 단위 기능
│   ├── current-location/  — Geolocation 감지 및 상태
│   ├── favorites/         — 즐겨찾기 CRUD, 별칭 편집, Zustand 스토어
│   ├── place-search/      — 장소 검색 입력 및 결과 UI
│   └── weather-lookup/    — 날씨 조회 결과 표시 (현재/시간대별)
│
├── widgets/       — 여러 feature를 조합한 복합 UI 블록
│   ├── favorite-section/   — 즐겨찾기 목록 + 카드 레이아웃
│   ├── location-header/    — 위치 표시 헤더
│   └── weather-dashboard/  — 검색 + 날씨 조회 통합 대시보드
│
└── pages/         — 페이지 컴포지션 (App Router에 마운트)
    ├── home/          — 홈 페이지 (`/`)
    └── district-detail/   — 지역 상세 페이지 (`/district/[id]`)
```

**레이어 의존성 규칙**: 각 레이어는 자신보다 하위 레이어만 import 할 수 있습니다.
`pages` → `widgets` → `features` → `entities` → `shared`

---

## 시작하기

### 요구사항
- Node.js 20 이상

### 설치

```bash
git clone <repository-url>
cd realteeth
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다 (아래 [환경 변수](#환경-변수) 섹션 참고):

```bash
# 아래 환경 변수 예시를 기준으로 .env.local 파일을 직접 생성
```

### 실행

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 검사
npm run lint

# TypeScript 타입 검사
npx tsc --noEmit
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000)에서 확인합니다.

---

## 환경 변수

`.env.local` 파일에 다음 키를 설정해야 합니다.

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `WEATHER_DATA_API_KEY` | 기상청 API 인증키 (URL 인코딩된 값) | [공공데이터 포털](https://www.data.go.kr) → "기상청_단기예보 ((구)_동네예보) 조회서비스" 신청 |
| `WEATHER_DATA_FORECAST_BASE_URL` | 기상청 단기예보 엔드포인트 | `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` |
| `WEATHER_DATA_NOWCAST_BASE_URL` | 기상청 초단기실황 엔드포인트 | `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` |
| `GEOCODER_API_KEY` | VWORLD 역지오코딩 API 키 | [VWORLD](https://www.vworld.kr) → Open API 신청 |

```env
WEATHER_DATA_API_KEY=<공공데이터포털_인증키>
WEATHER_DATA_FORECAST_BASE_URL=https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
WEATHER_DATA_NOWCAST_BASE_URL=https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst
GEOCODER_API_KEY=<VWORLD_API_키>
```

---

## 프로젝트 구조

```
realteeth/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── weather/        # 기상청 API 프록시 Route Handler
│   │   └── geocoder/       # VWORLD 역지오코딩 프록시 Route Handler
│   ├── district/
│   │   └── [id]/           # 지역 상세 페이지 (/district/[id])
│   ├── error.tsx           # 전역 에러 경계
│   ├── loading.tsx         # 전역 로딩 Suspense 경계
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx            # 홈 페이지 (/)
│   └── providers.tsx       # QueryClient 등 전역 Provider
├── fsd/                    # Feature-Sliced Design 레이어
│   ├── shared/
│   ├── entities/
│   ├── features/
│   ├── widgets/
│   └── pages/
├── public/
│   ├── korea_districts.json  # 대한민국 행정구역 데이터
│   └── district_grid.json    # 기상청 격자 좌표 매핑 데이터
└── docs/                   # 아키텍처 문서 및 개발 스펙
```
