import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Download,
  Plus,
} from "lucide-react";

type SortField =
  | "name"
  | "region"
  | "price"
  | "rating"
  | "visits"
  | null;
type SortOrder = "asc" | "desc";
type CampgroundStatus = "active" | "inactive"; // 이 부분 수정함.
type StatusFilter = "all" | CampgroundStatus; // 추가함.

interface Campground {
  //id: string;
  id: number;
  name: string;
  region: string;
  address: string;
  //type: string;
  price: number;
  rating: number; // 없으니까 임의값 or 0
  visits: number; // 없으니까 임의값 or 0
  status: CampgroundStatus;
  petAllowed: string; // 수정   // "가능" | "불가능"
  facilities: string; // 수정   // "화로대,샤워실,..." 형태
  //lastUpdated: string;
  //image: string;              // 이미지.
}

// 캠핑장 리스트 id랑 전반적으로 수정함
const mockData: Campground[] = [
  {
    id: 1,
    name: "데일리랜드",
    region: "강원",
    address: "강원도 춘천시 동산면 윗성골길 36",
    price: 58000, // price_off_weekend 기준
    rating: 4.5,
    visits: 1247,
    status: "active" as const, // "운영중" → active
    petAllowed: "불가능", // pet_allowed 매핑
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,마트.편의점", // 실제 데이터
  },
  {
    id: 2,
    name: "주식회사 디노 담양힐링파크 지점",
    region: "전라남도",
    address: "전라남도 담양군 봉산면 탄금길 9-26",
    price: 65000,
    rating: 4.2,
    visits: 892,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,산책로,운동시설,마트.편의점",
  },
  {
    id: 3,
    name: "(주)쉐르빌리안티티",
    region: "강원",
    address: "강원도 홍천군 서면 밤벌길19번길 111",
    price: 58000,
    rating: 4.0,
    visits: 1567,
    status: "inactive",
    petAllowed: "가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,운동장,운동시설,마트.편의점",
  },
  {
    id: 4,
    name: "(주)아웃오브파크",
    region: "강원",
    address: "강원도 춘천시 남면 가옹개길 52-9",
    price: 58000,
    rating: 4.3,
    visits: 2034,
    status: "active",
    petAllowed: "불가능",
    facilities: "운동시설",
  },
  {
    id: 5,
    name: "(주)양촌여울체험캠프",
    region: "경상남도",
    address: "경상남도 창원시 마산합포구 진전면 의산삼일로 60",
    price: 72000,
    rating: 4.1,
    visits: 765,
    status: "active",
    petAllowed: "가능(소형견)",
    facilities: "전기,온수,물놀이장,산책로,마트.편의점",
  },
  {
    id: 6,
    name: "어반슬로우시티",
    region: "강원",
    address: "강원도 춘천시 남면 가옹개길 108",
    price: 58000,
    rating: 4.4,
    visits: 1890,
    status: "active",
    petAllowed: "불가능",
    facilities: "정보없음",
  },
  {
    id: 7,
    name: "이스케이프 지점 (휴토피아)",
    region: "강원",
    address: "강원도 홍천군 서면 팔봉산로 976",
    price: 72000,
    rating: 4.6,
    visits: 2345,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,마트.편의점",
  },
  {
    id: 8,
    name: "드림랜드오토캠핑장",
    region: "경상북도",
    address: "경상북도 영천시 고경면 고도길 38",
    price: 58000,
    rating: 4.7,
    visits: 3012,
    status: "active",
    petAllowed: "가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,산책로,운동장,운동시설,마트.편의점",
  },
  {
    id: 9,
    name: "제주 자연인 글램핑",
    region: "제주도",
    address: "제주도 제주시 아란서길 110-0",
    price: 124000,
    rating: 4.8,
    visits: 4567,
    status: "active",
    petAllowed: "불가능",
    facilities: "운동시설",
  },
  {
    id: 10,
    name: "(주)태평소금 천일염 힐링캠프",
    region: "전라남도",
    address: "전라남도 신안군 증도면 지도증도로 1053-11",
    price: 72000,
    rating: 4.2,
    visits: 1234,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,장작판매,온수,물놀이장,놀이터,마트.편의점",
  },
  {
    id: 11,
    name: "353캠핑",
    region: "경기",
    address: "경기도 포천시 영북면 산정리 353",
    price: 65000,
    rating: 4.1,
    visits: 987,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수,물놀이장,운동시설",
  },
  {
    id: 12,
    name: "505펜션&캠핑(오공오)",
    region: "충청남도",
    address: "충청남도 공주시 사곡면 호계황골길 43",
    price: 65000,
    rating: 4.3,
    visits: 1456,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,산책로,운동장,운동시설,마트.편의점",
  },
  {
    id: 13,
    name: "(중복제거) 80 SS 오토캠핑장",
    region: "경상북도",
    address: "경상북도 군위군 부계면 남산리 1138-4번지",
    price: 72000,
    rating: 3.9,
    visits: 672,
    status: "inactive",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,운동시설",
  },
  {
    id: 14,
    name: "A&J오토캠핑장",
    region: "강원",
    address: "강원도 원주시 지정면 안창리 산 56-3",
    price: 58000,
    rating: 4.0,
    visits: 823,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "전기",
  },
  {
    id: 15,
    name: "Camp＆Joy",
    region: "전라남도",
    address: "전라남도 신안군 압해읍 압해로 201",
    price: 58000,
    rating: 4.2,
    visits: 1102,
    status: "inactive",
    petAllowed: "가능",
    facilities: "물놀이장",
  },
  {
    id: 16,
    name: "Camp 1950",
    region: "경상북도",
    address: "경상북도 김천시 대덕면 남김천대로 160",
    price: 58000,
    rating: 4.4,
    visits: 1987,
    status: "inactive",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,산책로,운동장,운동시설,마트.편의점",
  },
  {
    id: 17,
    name: "CLUB 596",
    region: "충청남도",
    address: "충청남도 태안군 남면 몽산리 596",
    price: 65000,
    rating: 4.6,
    visits: 2678,
    status: "inactive",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,산책로",
  },
  {
    id: 18,
    name: "DMZ  마루 캠핑",
    region: "경기",
    address: "경기도 연천군 중면 군중로 399",
    price: 65000,
    rating: 4.5,
    visits: 3345,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,운동시설",
  },
  {
    id: 19,
    name: "DMZ 캠핑장",
    region: "강원",
    address: "강원도 철원군 철원읍 독서당길 225-134",
    price: 58000,
    rating: 4.3,
    visits: 2890,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,장작판매",
  },
  // 기존 mockData 배열에 아래 데이터들을 추가 (id: 20부터)
  {
    id: 20,
    name: "EBS골드캠핑장",
    region: "경기",
    address: "경기도 용인시 기흥구 기흥단지로 397 (고매동)",
    price: 65000,
    rating: 4.5,
    visits: 4123,
    status: "inactive",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,산책로,운동장,운동시설,마트.편의점",
  },
  {
    id: 21,
    name: "F1오토캠핑장",
    region: "전라남도",
    address: "전라남도 영암군 삼호읍 삼포리 1894",
    price: 58000,
    rating: 4.0,
    visits: 1567,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "온수,운동장",
  },
  {
    id: 22,
    name: "JB캠핑하우스",
    region: "경기",
    address: "경기도 파주시 적성면 감악산로 1270-74",
    price: 52000,
    rating: 4.2,
    visits: 2345,
    status: "active",
    petAllowed: "불가능",
    facilities: "정보없음",
  },
  {
    id: 23,
    name: "MG펜션(연천수영장캠핑장)",
    region: "경기",
    address: "경기도 연천군 신서면 연신로 1622-1",
    price: 65000,
    rating: 4.4,
    visits: 2987,
    status: "active",
    petAllowed: "가능",
    facilities: "물놀이장,운동시설",
  },
  {
    id: 24,
    name: "Najost Camp",
    region: "강원",
    address: "강원도 영월군 김삿갓면 김삿갓로 638",
    price: 58000,
    rating: 4.3,
    visits: 1876,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,장작판매,온수",
  },
  {
    id: 25,
    name: "THATS CAMPING 횡성자연휴양림야영장",
    region: "강원",
    address: "강원도 횡성군 갑천면정포로430번길 113",
    price: 72000,
    rating: 4.6,
    visits: 3456,
    status: "inactive",
    petAllowed: "불가능",
    facilities:
      "전기,장작판매,온수,물놀이장,놀이터,운동장,운동시설,마트.편의점",
  },
  {
    id: 26,
    name: "The Star 오토캠핑장",
    region: "전라남도",
    address: "전라남도 여수시 돌산읍 상하동길 268",
    price: 58000,
    rating: 4.7,
    visits: 4567,
    status: "active",
    petAllowed: "가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,운동시설",
  },
  {
    id: 27,
    name: "(중복제거) VIP레저타운",
    region: "강원",
    address: "강원도 원주시 지정면 지정로 1393",
    price: 52000,
    rating: 4.1,
    visits: 1234,
    status: "inactive",
    petAllowed: "가능",
    facilities: "정보없음",
  },
  {
    id: 28,
    name: "VIP오토캠핑장",
    region: "경상남도",
    address: "경상남도 밀양시 단장면 고례3길 10-11",
    price: 46000,
    rating: 4.0,
    visits: 890,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,트렘폴린",
  },
  {
    id: 29,
    name: "월명 글램핑",
    region: "경상남도",
    address: "경상남도 산청군 산청읍 웅석봉로285번길 80-20",
    price: 143000,
    rating: 4.8,
    visits: 5678,
    status: "active",
    petAllowed: "가능(소형견)",
    facilities:
      "전기,무선인터넷,장작판매,온수,물놀이장,놀이터,산책로,운동장,마트.편의점",
  },
  // 기존 mockData 배열에 아래 데이터들을 추가 (id: 30부터)
  {
    id: 30,
    name: "YC글램핑",
    region: "경기",
    address: "경기도 연천군 미산면 청정로 1049",
    price: 143000,
    rating: 4.7,
    visits: 4567,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "물놀이장,운동시설",
  },
  {
    id: 31,
    name: "옐로우힐",
    region: "강원",
    address: "강원도 춘천시 동산면 종자리로 224-24",
    price: 52000,
    rating: 4.2,
    visits: 2345,
    status: "active",
    petAllowed: "불가능",
    facilities: "정보없음",
  },
  {
    id: 32,
    name: "(주)농업법인 한국영농 오토캠핑장",
    region: "충청북도",
    address: "충청북도 청주시 청원구 오창읍 여천리 35-5",
    price: 72000,
    rating: 4.3,
    visits: 1678,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수,물놀이장,산책로",
  },
  {
    id: 33,
    name: "㈜씨스테이 야영장",
    region: "경기",
    address: "경기도 옹진군 영흥면 내리 1212-52",
    price: 65000,
    rating: 4.4,
    visits: 2890,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,온수,물놀이장,운동시설",
  },
  {
    id: 34,
    name: "(주)제주글램핑",
    region: "제주도",
    address: "제주도 제주시 구좌읍 덕천리 1288-2",
    price: 136000,
    rating: 4.6,
    visits: 3789,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "전기,온수,물놀이장,놀이터,운동시설",
  },
  {
    id: 35,
    name: "가람펜션캠핑장",
    region: "경상남도",
    address: "경상남도 합천군 봉산면 인덕로 930",
    price: 65000,
    rating: 4.1,
    visits: 1234,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,운동시설",
  },
  {
    id: 36,
    name: "가래골농원 캠핑장",
    region: "경기",
    address: "경기도 포천시 창수면 포천로2811번길 178",
    price: 65000,
    rating: 4.5,
    visits: 3456,
    status: "active",
    petAllowed: "가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,운동시설,마트.편의점",
  },
  {
    id: 37,
    name: "가루실 캠프",
    region: "충청남도",
    address: "충청남도 예산군 덕산면 가루실길 229-23",
    price: 65000,
    rating: 4.3,
    visits: 1987,
    status: "inactive",
    petAllowed: "가능(소형견)",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,운동시설",
  },
  {
    id: 38,
    name: "가리산자연휴양림 야영장",
    region: "강원",
    address: "강원도 홍천군 두촌면 가리산길 426",
    price: 46000,
    rating: 4.2,
    visits: 2567,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "무선인터넷,놀이터,운동시설",
  },
  {
    id: 39,
    name: "가마실캠핑장",
    region: "충청북도",
    address: "충청북도 제천시 의병대로61길 50 (자작동)",
    price: 65000,
    rating: 4.4,
    visits: 4123,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수,트렘폴린,물놀이장,운동시설",
  },
  // 기존 mockData 배열에 아래 데이터들을 추가 (id: 40부터) - 최종!
  {
    id: 40,
    name: "가산글램핑",
    region: "경상북도",
    address: "경상북도 칠곡군 가산면 학하2길 54-55",
    price: 143000,
    rating: 4.6,
    visits: 5234,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,온수,트렘폴린,물놀이장,놀이터,산책로,운동시설",
  },
  {
    id: 41,
    name: "팔공산 국립공원 가산산성 야영장",
    region: "경상북도",
    address: "경상북도 칠곡군 동명면 한티로 1034",
    price: 58000,
    rating: 4.3,
    visits: 3123,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "정보없음",
  },
  {
    id: 42,
    name: "가야권역 소리마실 영농조합법인",
    region: "경상남도",
    address: "경상남도 합천군 가야면 가야산로 1267",
    price: 58000,
    rating: 4.1,
    visits: 1789,
    status: "inactive",
    petAllowed: "가능(소형견)",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,운동장,운동시설",
  },
  {
    id: 43,
    name: "가야달빛야영장",
    region: "경상남도",
    address: "경상남도 김해시 신어산길 67 (삼방동)",
    price: 58000,
    rating: 4.0,
    visits: 1456,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수,운동시설",
  },
  {
    id: 44,
    name: "가온누리캠핑체험장",
    region: "경상북도",
    address: "경상북도 경주시 안강읍 호국로 2037",
    price: 58000,
    rating: 4.5,
    visits: 3890,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,트렘폴린,물놀이장,놀이터,산책로,운동장,운동시설,마트.편의점",
  },
  {
    id: 45,
    name: "가우도카라반펜션",
    region: "전라남도",
    address: "전라남도 강진군 대구면 저두바닷길 3",
    price: 124000,
    rating: 4.7,
    visits: 4678,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,온수,물놀이장,놀이터,운동시설",
  },
  {
    id: 46,
    name: "가은 해솔 캠핑장",
    region: "경상북도",
    address: "경상북도 문경시 가은읍 원북리 177-6",
    price: 72000,
    rating: 4.2,
    visits: 2567,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수,물놀이장",
  },
  {
    id: 47,
    name: "변산오토캠핑장",
    region: "전라북도",
    address: "전라북도 부안군 변산면 변산로 2054",
    price: 52000,
    rating: 4.4,
    visits: 3345,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,장작판매,온수",
  },
  {
    id: 48,
    name: "가족쉼터",
    region: "경기",
    address: "경기도 남양주시 수동면 비룡로 1603",
    price: 58000,
    rating: 4.3,
    visits: 4231,
    status: "active",
    petAllowed: "불가능",
    facilities:
      "전기,무선인터넷,장작판매,온수,놀이터,마트.편의점",
  },
  {
    id: 49,
    name: "청계산 골든밸리 가족캠핑장",
    region: "경기",
    address:
      "경기도 성남시 수정구 달래내로221번길 17-5 (금토동)",
    price: 46000,
    rating: 4.1,
    visits: 1987,
    status: "active",
    petAllowed: "불가능",
    facilities: "전기,장작판매,온수",
  },
  {
    id: 50,
    name: "가지산자연캠핑장",
    region: "경상남도",
    address: "경상남도 울주군 삽재로 279-22 가지산자연",
    price: 58000,
    rating: 4.5,
    visits: 3678,
    status: "inactive",
    petAllowed: "불가능",
    facilities: "전기,무선인터넷,장작판매,온수,운동시설",
  },
];

export function CampgroundManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [data, setData] = useState(mockData);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusToggle = (id: number) => {
    setData(
      data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status:
              item.status === "active"
                ? "inactive"
                : ("active" as CampgroundStatus),
          };
        }
        return item;
      }),
    );
  };

  const filteredData = data
    .filter((item) => {
      if (
        searchQuery &&
        !item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (
        regionFilter !== "all" &&
        item.region !== regionFilter
      ) {
        return false;
      }
      // Type filter removed since type field doesn't exist in Campground interface
      if (
        statusFilter !== "all" &&
        item.status !== statusFilter
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const activeCount = data.filter(
    (item) => item.status === "active",
  ).length;
  const inactiveCount = data.filter(
    (item) => item.status === "inactive",
  ).length;
  const recentlyUpdated = data.slice(0, 3);

  const getStatusColor = (status: CampgroundStatus) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // const getStatusLabel = (status: CampgroundStatus) => {
  //   switch (status) {
  //     case "active":
  //       return "운영중";
  //     case "inactive":
  //       return "휴업";
  //     case "pending":
  //       return "대기중";
  //     default:
  //       return status;
  //   }
  // };
  const getStatusLabel = (status: CampgroundStatus) => {
    return status === "active" ? "운영중" : "휴업";
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              캠핑장 관리
            </h1>
            <p className="text-sm text-gray-600">
              전국 캠핑장 정보를 조회하고 관리할 수 있습니다
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              캠핑장 등록
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">
            운영중
          </div>
          <div className="text-2xl font-semibold text-emerald-600">
            {activeCount}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">휴업</div>
          <div className="text-2xl font-semibold text-gray-600">
            {inactiveCount}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main Table Area */}
        <div className="col-span-2">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-4 gap-3">
              {/* Search */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  캠핑장 검색
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="캠핑장 이름으로 검색"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  지역
                </label>
                <div className="relative">
                  <select
                    value={regionFilter}
                    onChange={(e) =>
                      setRegionFilter(e.target.value)
                    }
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="all">전체 지역</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="강원">강원</option>
                    <option value="충북">충북</option>
                    <option value="충남">충남</option>
                    <option value="전북">전북</option>
                    <option value="전남">전남</option>
                    <option value="경북">경북</option>
                    <option value="경남">경남</option>
                    <option value="제주">제주</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  유형
                </label>
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(e.target.value)
                    }
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="all">전체 유형</option>
                    <option value="일반캠핑">일반캠핑</option>
                    <option value="오토캠핑">오토캠핑</option>
                    <option value="글램핑">글램핑</option>
                    <option value="카라반">카라반</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Filter - Second Row */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  상태
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">운영중</option>
                    <option value="inactive">휴업</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRegionFilter("all");
                    setTypeFilter("all");
                    setStatusFilter("all");
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  총{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredData.length}
                  </span>
                  개의 캠핑장
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Filter className="w-4 h-4" />
                  <span>
                    {data.length - filteredData.length}개
                    필터링됨
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        캠핑장명
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      <button
                        onClick={() => handleSort("region")}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        지역
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      주소
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      <button
                        onClick={() => handleSort("price")}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        가격
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      <button
                        onClick={() => handleSort("rating")}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        평점
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      <button
                        onClick={() => handleSort("visits")}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        방문수
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      상태
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/campground/${item.id}`)
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">
                          {item.region}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 max-w-[200px] truncate block">
                          {item.address}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          ₩{item.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {item.rating}
                          </span>
                          <span className="text-amber-400">
                            ★
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">
                          {item.visits.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(item.id);
                          }}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/campground/${item.id}`,
                              );
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="상세보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="더보기"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                1-{filteredData.length} of {filteredData.length}{" "}
                항목
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  이전
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white bg-teal-600 border border-teal-600 rounded">
                  1
                </button>
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Recently Updated */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              최근 업데이트
            </h3>
            <div className="space-y-3">
              {recentlyUpdated.map((item) => (
                <div
                  key={item.id}
                  className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {item.region}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(item.status)}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              빠른 작업
            </h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                일괄 가격 수정
              </button>
              <button className="w-full px-3 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                상태 일괄 변경
              </button>
              <button className="w-full px-3 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                엑셀 업로드
              </button>
              <button className="w-full px-3 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                리포트 생성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}