# RealTeeth 프론트엔드 과제 (Weather App) 

공공데이터 포털 기상청 API 및 KAKAO API를 활용한 현재 위치 기반 날씨 조회 앱입니다.

---

## 주요 기능

- **안정적인 첫 진입 UX**
  - 현재 위치 확인 중 `WeatherDashboard` 영역을 스켈레톤으로 선점하여 CLS를 최소화
  - 날씨 응답 대기 중에도 실제 카드 레이아웃과 유사한 스켈레톤 유지
  - 위치 상태 메시지 영역 높이를 고정하여 헤더 제목 점프 방지
  - 즐겨찾기 카드 로딩/오류를 카드 단위로 격리하여 목록 전체가 흔들리지 않음

- **현재 위치 기반 날씨**
  - 앱 첫 진입 시 브라우저 Geolocation API로 현재 위치를 자동 감지
  - 감지된 좌표를 기상청 격자 좌표로 변환하여 날씨 정보 조회
  - 위도/경도를 Kakao 역지오코딩 API를 통해 도로명 주소로 변환하여 표시(해당 부분은 필수 기능이 아니지만 추가하였음.)

- **날씨 정보 표시**
  - 현재 기온 (기상청 초단기실황)
  - 당일 최저/최고 기온
  - 시간대별 기온 예보 (기상청 단기예보)

- **장소 검색**
  - 시/도·시/군/구·읍/면/동 단위 통합 검색
  - 디바운싱 적용으로 입력 중 실시간 검색
  - `korea_districts.json` 기반 클라이언트 사이드 검색 (서버 요청 없음)

- **즐겨찾기**
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

프로젝트 루트의 `.env.example`을 복사하여 `.env.local`을 생성하고, 각 항목에 실제 값을 입력합니다 (아래 [환경 변수](#환경-변수) 섹션 참고):

```bash
cp .env.example .env.local
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

`.env.local` 파일에 다음 키를 설정해야 합니다. 모든 외부 API는 서버 Route Handler를 통해 호출되므로 `NEXT_PUBLIC_` 접두사 없이 서버 전용 변수로 관리합니다.

| 변수명 | 설명 | 발급처 |
|--------|------|--------|
| `WEATHER_DATA_API_KEY` | 기상청 API 인증키 (URL 인코딩된 값) | [공공데이터 포털](https://www.data.go.kr) → "기상청_단기예보 ((구)_동네예보) 조회서비스" 신청 |
| `WEATHER_DATA_FORECAST_BASE_URL` | 기상청 단기예보 엔드포인트 | `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` |
| `WEATHER_DATA_NOWCAST_BASE_URL` | 기상청 초단기실황 엔드포인트 | `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` |
| `KAKAO_REST_API_KEY` | Kakao 역지오코딩 REST API 키 | [Kakao Developers](https://developers.kakao.com) → 앱 생성 → REST API 키 |
| `KAKAO_GEOCODER_BASE_URL` | Kakao 역지오코딩 엔드포인트 | `https://dapi.kakao.com/v2/local/geo/coord2address.json` |

```env
WEATHER_DATA_API_KEY=<공공데이터포털_인증키>
WEATHER_DATA_FORECAST_BASE_URL=https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
WEATHER_DATA_NOWCAST_BASE_URL=https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst
KAKAO_REST_API_KEY=<Kakao_REST_API_키>
KAKAO_GEOCODER_BASE_URL=https://dapi.kakao.com/v2/local/geo/coord2address.json
```

---

## 프로젝트 구조

```text
realteeth/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── weather/        # 기상청 API 프록시 Route Handler
│   │   └── geocoder/       # Kakao 역지오코딩 프록시 Route Handler
│   ├── district/
│   │   └── [id]/           # 지역 상세 페이지 (/district/[id])
│   ├── error.tsx           # 전역 에러 경계
│   ├── loading.tsx         # 전역 로딩 Suspense 경계
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx            # 홈 페이지 (/)
│   └── providers.tsx       # QueryClient 등 전역 Provider
├── fsd/                    # Feature-Sliced Design 레이어
│   ├── shared/             — 도메인에 무관한 범용 코드 (api, config, lib, model, ui)
│   ├── entities/           — 도메인 모델 (district, weather)
│   ├── features/           — 사용자 시나리오 단위 기능 (current-location, favorites, place-search, weather-lookup)
│   ├── widgets/            — 여러 feature를 조합한 복합 UI 블록 (favorite-section, location-header, weather-dashboard)
│   └── pages/              — 페이지 컴포지션 (home, district-detail)
├── public/
│   ├── korea_districts.json  # 대한민국 행정구역 데이터
│   └── district_grid.json    # 기상청 격자 좌표 매핑 데이터
└── docs/                   # 아키텍처 문서 및 개발 스펙
```

**레이어 의존성 규칙 (FSD)**: 각 레이어는 자신보다 하위 레이어만 import 할 수 있습니다.
`pages` → `widgets` → `features` → `entities` → `shared`

---

## 기술적 의사결정

### 확장성과 유지보수성을 고려한 FSD (Feature-Sliced Design) 아키텍처 도입
**FSD 패턴을 도입하여 비즈니스 로직과 UI 컴포넌트의 결합도를 낮추고 예측 가능한 코드베이스를 구축했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
단순한 컴포넌트 기반 폴더 구조를 넘어, 비즈니스 로직과 UI 컴포넌트의 결합도를 낮추기 위해 FSD 패턴을 도입했습니다. 
레이어 간 의존성 방향을 단방향(`shared → entities → features → widgets → pages`)으로 강제함으로써, 특정 기능(예: 즐겨찾기, 장소 검색)을 추가하거나 수정할 때 다른 도메인에 미치는 사이드이펙트를 원천 차단했습니다. 이는 추후 앱이 확장되더라도 예측 가능한 코드베이스를 유지할 수 있게 해줍니다.
</details>

### 로딩 UX 안정화 및 장애 격리 (Skeleton + Local ErrorBoundary)
**스켈레톤 UI를 선점하여 CLS를 최소화하고, ErrorBoundary를 통해 특정 영역의 오류가 전체 앱 다운으로 이어지지 않도록 장애를 격리했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
날씨 앱의 특성상 `Geolocation 감지`와 `외부 API(기상청, 역지오코딩)` 통신이 연쇄적으로 발생하여 **초기 로딩 지연이 필연적으로 발생**합니다. 이를 처리하기 위해 다음 두 가지를 중점적으로 개선했습니다.

1. **Skeleton UI로 CLS(Cumulative Layout Shift) 최소화 및 체감 속도 향상**
   홈 첫 진입 시 `WeatherDashboard`나 즐겨찾기가 단순 스피너 후 튀어나오는 현상을 방지하고자, 최종 레이아웃과 동일한 높이/형태의 스켈레톤으로 공간을 먼저 선점했습니다. 이는 레이아웃 점프를 막을 뿐만 아니라, 사용자의 인지적 대기 시간을 줄여줍니다.

2. **선언적 비동기 처리 및 ErrorBoundary를 통한 장애 격리**
   컴포넌트 내부에 `if (isLoading)` / `if (isError)` 같은 선형적인 분기 처리를 두는 대신, `Suspense`와 `react-error-boundary`를 조합해 비동기 상태 처리를 컴포넌트 외부로 위임했습니다. 
   특히 공공데이터 API의 간헐적 오류에 대비해 대시보드와 각 즐겨찾기 카드를 독립된 에러 바운더리로 감쌌습니다. 특정 지역의 조회가 실패하더라도 전체 앱이 크래시되는 대신 **해당 카드에만 Fallback UI와 재시도 버튼이 노출**되어 앱의 안정성(Resilience)을 크게 높였습니다.
</details>

### TanStack Query 기반의 효율적인 서버 상태 및 캐싱 관리
**`useSuspenseQuery`로 Suspense와의 연동을 매끄럽게 하고 QueryClient 설정으로 불필요한 네트워크 요청을 줄여 최적화했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
단순한 데이터 페칭을 넘어 서버 상태(Server State)의 라이프사이클을 세밀하게 제어하기 위해 TanStack Query를 활용했습니다.
메인 날씨 조회에는 `useSuspenseQuery`를 적용해 React Suspense와 매끄럽게 연동되도록 구성했으며, `QueryClient` 전역 설정(`gcTime: 5분`, `refetchOnWindowFocus: false` 등)을 기상청 API 갱신 주기에 맞춰 최적화했습니다. 불필요한 중복 네트워크 요청을 줄이고, 사용자에게 가장 최신의 날씨 데이터를 빠르게 제공합니다.
</details>

### 관심사 분리를 통한 클라이언트 상태 관리 (Zustand)
**Zustand와 `persist`를 통해 사용자의 즐겨찾기 데이터를 브라우저에 영속적으로 저장하고, 서버 상태와 클라이언트 상태 영역을 명확히 분리했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
서버 데이터(날씨)와 클라이언트 데이터(즐겨찾기 목록)의 상태 관리 영역을 명확하게 분리하여 각 도구가 본연의 역할에 충실하도록 설계했습니다. 
서버와 동기화가 필요한 데이터는 TanStack Query에 위임하고, 사용자의 로컬 환경에 종속적인 '즐겨찾기 목록과 별칭(Alias)' 데이터는 Zustand와 `persist` 미들웨어를 결합해 구현했습니다. 이를 통해 상태 관리의 복잡도를 낮추고, 새로고침 시에도 데이터가 영속적으로 유지되도록 UX를 향상시켰습니다.
</details>

### 외부 API 응답을 신뢰하지 않는 방어적 프로그래밍 (Zod 런타임 스키마 검증)
**Zod를 도입해 외부 API 응답을 런타임에 직접 검증함으로써, 예상치 못한 데이터 변형으로 인한 렌더링 에러를 방지했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
TypeScript의 정적 타입 검사만으로는 런타임에 발생하는 기상청 API 등 외부 데이터의 구조 변경이나 누락을 막을 수 없습니다. 
따라서 Zod를 도입해 API 계층에서 데이터 페칭 직후 응답 스키마를 검증(Parsing)하도록 파이프라인을 구축했습니다. 예상치 못한 외부 불안정 요소나 응답 장애 시, 잘못된 데이터가 UI 레이어까지 전파되어 렌더링 에러를 발생시키는 것을 미연에 방지합니다.
</details>

### 끊김 없는 UX를 위한 클라이언트 사이드 인메모리 검색 지원
**작은 크기의 정적 데이터 특성을 활용해 디바운싱 기반의 클라이언트 사이드 인메모리 검색으로 실시간 검색을 부드럽게 구현했습니다.**

<details>
<summary><b>자세한 내용 보기</b></summary>
<br />
대한민국 행정구역 정보(`korea_districts.json`)는 데이터 자체의 변경 빈도가 매우 낮고 크기가 제한적이라는 도메인 특성이 있습니다. 
이를 API 호출 방식이 아닌 클라이언트 로컬 메모리에 적재하여 처리하는 방식을 택했습니다. 디바운싱(Debouncing) 기법과 결합하여, 사용자가 타이핑하는 즉시 네트워크 지연(Latency) 없이 부드러운 실시간 검색 결과를 제공합니다.
</details>
