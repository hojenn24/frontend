import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Phone, 
  Mail, 
  Wifi,
  Zap,
  ShowerHead,
  Car,
  Store,
  Trees,
  Tent,
  Calendar,
  Users,
  DollarSign,
  Star,
  Upload,
  Image as ImageIcon
} from "lucide-react";

// Mock data - in real app this would come from an API
const mockCampgroundData = {
  "C001": {
    id: "C001",
    name: "강촌 오토캠핑장",
    region: "강원",
    status: "active",
    type: "오토캠핑",
    price: 55000,
    rating: 4.5,
    visits: 1247,
    address: "강원도 춘천시 남산면 강촌길 123",
    detailAddress: "강촌마을 내 위치",
    phone: "033-123-4567",
    email: "gangchon.camp@example.com",
    manager: "김철수",
    description: "아름다운 자연 경관을 자랑하는 강촌 오토캠핑장입니다. 가족 단위 캠핑객에게 최적화된 시설을 갖추고 있으며, 사계절 운영으로 언제든지 방문 가능합니다. 인근에 강촌 레일바이크, 남이섬 등 다양한 관광 명소가 있어 가족 여행지로 인기가 높습니다.",
    capacity: 50,
    openDate: "2020.03.15",
    facilities: {
      parking: true,
      electricity: true,
      water: true,
      wifi: true,
      shower: true,
      toilet: true,
      store: true,
      cooking: true,
    },
    operatingHours: "24시간 운영",
    checkIn: "14:00",
    checkOut: "11:00",
    lastUpdated: "2026.04.15",
  },
  "C002": {
    id: "C002",
    name: "제주 힐링캠프",
    region: "제주",
    status: "active",
    type: "글램핑",
    price: 89000,
    rating: 4.7,
    visits: 2156,
    address: "제주특별자치도 서귀포시 안덕면 화순로 456",
    detailAddress: "제주 서남부 해안가",
    phone: "064-789-0123",
    email: "jeju.healing@example.com",
    manager: "박영희",
    description: "제주의 아름다운 바다를 바라보며 편안한 휴식을 즐길 수 있는 프리미엄 글램핑 시설입니다. 고급 침구류와 냉난방 시설을 갖춘 텐트로 초보자도 편하게 캠핑을 즐길 수 있습니다. 일몰이 특히 아름다운 명소로 유명합니다.",
    capacity: 30,
    openDate: "2021.05.20",
    facilities: {
      parking: true,
      electricity: true,
      water: true,
      wifi: true,
      shower: true,
      toilet: true,
      store: true,
      cooking: false,
    },
    operatingHours: "24시간 운영",
    checkIn: "15:00",
    checkOut: "11:00",
    lastUpdated: "2026.04.16",
  },
  // Add more mock data as needed
};

export function CampgroundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const campground = id ? mockCampgroundData[id as keyof typeof mockCampgroundData] : null;

  if (!campground) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">캠핑장 정보를 찾을 수 없습니다.</p>
          <button 
            onClick={() => navigate("/campground")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "운영중";
      case "inactive":
        return "휴업";
      case "pending":
        return "대기중";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/campground")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              수정
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{campground.name}</h1>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getStatusColor(campground.status)}`}>
                {getStatusLabel(campground.status)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{campground.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tent className="w-4 h-4" />
                <span>{campground.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>개장일: {campground.openDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left Column - Main Info */}
        <div className="col-span-2 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-xs text-gray-600">가격</div>
              </div>
              <div className="text-xl font-semibold text-gray-900">₩{campground.price.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Star className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xs text-gray-600">평점</div>
              </div>
              <div className="text-xl font-semibold text-gray-900">{campground.rating}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-600">방문 수</div>
              </div>
              <div className="text-xl font-semibold text-gray-900">{campground.visits.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Tent className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs text-gray-600">수용 인원</div>
              </div>
              <div className="text-xl font-semibold text-gray-900">{campground.capacity}팀</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3">캠핑장 소개</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {campground.description}
            </p>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">시설 정보</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.parking ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Car className={`w-6 h-6 mb-2 ${campground.facilities.parking ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.parking ? 'text-teal-700' : 'text-gray-500'}`}>
                  주차장
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.electricity ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Zap className={`w-6 h-6 mb-2 ${campground.facilities.electricity ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.electricity ? 'text-teal-700' : 'text-gray-500'}`}>
                  전기
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.water ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Trees className={`w-6 h-6 mb-2 ${campground.facilities.water ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.water ? 'text-teal-700' : 'text-gray-500'}`}>
                  급수
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.wifi ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Wifi className={`w-6 h-6 mb-2 ${campground.facilities.wifi ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.wifi ? 'text-teal-700' : 'text-gray-500'}`}>
                  Wi-Fi
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.shower ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <ShowerHead className={`w-6 h-6 mb-2 ${campground.facilities.shower ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.shower ? 'text-teal-700' : 'text-gray-500'}`}>
                  샤워실
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.toilet ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <ShowerHead className={`w-6 h-6 mb-2 ${campground.facilities.toilet ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.toilet ? 'text-teal-700' : 'text-gray-500'}`}>
                  화장실
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.store ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Store className={`w-6 h-6 mb-2 ${campground.facilities.store ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.store ? 'text-teal-700' : 'text-gray-500'}`}>
                  매점
                </span>
              </div>

              <div className={`flex flex-col items-center p-3 rounded-lg ${campground.facilities.cooking ? 'bg-teal-50' : 'bg-gray-50'}`}>
                <Store className={`w-6 h-6 mb-2 ${campground.facilities.cooking ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${campground.facilities.cooking ? 'text-teal-700' : 'text-gray-500'}`}>
                  취사장
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">운영 정보</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">운영 시간</div>
                <div className="text-sm font-medium text-gray-900">{campground.operatingHours}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">체크인</div>
                <div className="text-sm font-medium text-gray-900">{campground.checkIn}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">체크아웃</div>
                <div className="text-sm font-medium text-gray-900">{campground.checkOut}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact & Media */}
        <div className="space-y-5">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">연락처 정보</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">주소</div>
                <div className="text-sm text-gray-900">{campground.address}</div>
                {campground.detailAddress && (
                  <div className="text-sm text-gray-600 mt-1">{campground.detailAddress}</div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div className="text-xs text-gray-600">전화번호</div>
                </div>
                <div className="text-sm font-medium text-gray-900">{campground.phone}</div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div className="text-xs text-gray-600">이메일</div>
                </div>
                <div className="text-sm font-medium text-gray-900">{campground.email}</div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600 mb-1">관리자</div>
                <div className="text-sm font-medium text-gray-900">{campground.manager}</div>
              </div>
            </div>
          </div>

          {/* Image/Map Upload Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">이미지 및 지도</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">이미지 업로드</p>
              <p className="text-xs text-gray-500">캠핑장 사진 또는 배치도를 추가하세요</p>
              <button className="mt-3 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-2 mx-auto">
                <Upload className="w-4 h-4" />
                파일 선택
              </button>
            </div>
          </div>

          {/* Update Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">최종 업데이트</div>
            <div className="text-sm font-medium text-gray-900">{campground.lastUpdated}</div>
            <div className="text-xs text-gray-500 mt-2">ID: {campground.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
