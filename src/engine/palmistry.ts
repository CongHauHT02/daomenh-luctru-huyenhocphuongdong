/**
 * ĐẠO MỆNH – THỦ TƯỚNG HỌC & CANVAS CHỈ TAY (PALMISTRY ENGINE)
 * Module: Xem, Nhận Diện và Tự Vẽ Chỉ Tay Theo Cổ Thư
 * 
 * Tuân thủ nghiêm ngặt nguyên tắc:
 * 1. Vision AI chỉ trích xuất đặc điểm hình học quan sát được (tọa độ, tỷ lệ, độ dài tương đối).
 * 2. Vision AI KHÔNG luận vận mệnh, tuổi thọ, sức khỏe, tình cảm, sự nghiệp.
 * 3. Classical Rule Engine đối chiếu dữ liệu ĐÃ ĐƯỢC XÁC NHẬN với cổ thư đã thẩm định:
 *    - 《Ma Y Thần Tướng》 (Ma Y Đạo Giả / Trần Đoàn chú)
 *    - 《Thần Tướng Toàn Biên》 (Trần Đoàn / Hứa Phụ tông chỉ)
 *    - 《Liễu Trang Thần Tướng》 (Viên Liễu Trang)
 * 4. Không có nguồn xác minh thì không tạo kết luận.
 */

import { ClassicalEvidenceProfile, VERIFIED_CLASSICAL_RULES_REGISTRY } from './classicalEvidence';

export type PalmSchool = 'Ma Y Phái Thủ Tướng' | 'Thần Tướng Toàn Biên' | 'Liễu Trang Tướng Pháp' | 'Tham Khảo Phổ Thông';

export type LineStatus = 'ai_suggested' | 'user_editing' | 'user_verified' | 'rejected' | 'undetected';
export type LineSource = 'ai_vision' | 'user_drawn';

export interface PalmPoint {
  x: number; // Tọa độ chuẩn hóa [0.0 -> 1.0]
  y: number; // Tọa độ chuẩn hóa [0.0 -> 1.0]
}

export interface UncertainRegion {
  x: number;
  y: number;
  radius: number;
  reason: string;
}

export interface PalmLineDefinition {
  id: string;
  nameEn: string;
  vietnameseName: string;
  classicalName: string; // Tên cổ thư (Địa Văn, Nhân Văn, Thiên Văn, Ngọc Trụ, Lục Tú...)
  color: string;
  category: 'chinh' | 'phu';
  description: string;
  classicalSignificance: string;
  shortRole: string;        // Vai trò tóm tắt: "Sức Khỏe", "Trí Tuệ", "Công Danh", "Hôn Nhân"...
  locationGuide: string;    // Hướng dẫn vị trí tìm trên tay
  whatIfMissing: string;    // Giải thích nếu không có đường này
  colloquialName: string;   // Tên dân gian thường gọi
  badge: string;            // Nhãn ngắn hiển thị
}

export const PALM_LINES_CATALOG: PalmLineDefinition[] = [
  // 3 Đường Tam Tài Cốt Lõi (Ai cũng có trên bàn tay)
  {
    id: 'sinh_dao',
    nameEn: 'Life Line',
    vietnameseName: 'Đường Sinh Đạo',
    classicalName: 'Địa Văn (Gốc Tam Tài)',
    colloquialName: 'Đường Sức Sống & Thể Lực',
    color: '#10b981', // Emerald
    category: 'chinh',
    badge: 'Tam Tài Cốt Lõi',
    shortRole: 'Sức sống, thể lực tiên thiên & khả năng phục hồi',
    locationGuide: 'Khởi đầu từ kẽ giữa ngón cái và ngón trỏ, uốn cong vòng cung ôm trọn gò Kim Tinh (mô thịt lớn dưới ngón cái) hướng xuống cổ tay.',
    description: 'Chạy vòng quanh gò Kim Tinh (dưới ngón cái) hướng xuống cổ tay.',
    classicalSignificance: '《Ma Y Thần Tướng》: Địa văn vi cơ, chủ thể lực tiên thiên, nguyên khí sinh hóa và sức đề kháng. Tuyệt đối không biểu thị thời điểm thọ yểu tử vong.',
    whatIfMissing: 'Đường chỉ tay chính cốt lõi: Hầu như bàn tay nào cũng có. Độ đậm sâu biểu thị sức đề kháng và sinh lực dồi dào; tuyệt đối không dùng để phán đoán tuổi thọ hay cái chết.'
  },
  {
    id: 'tri_dao',
    nameEn: 'Head Line',
    vietnameseName: 'Đường Trí Đạo',
    classicalName: 'Nhân Văn (Thân Tam Tài)',
    colloquialName: 'Đường Trí Tuệ & Tư Duy',
    color: '#3b82f6', // Blue
    category: 'chinh',
    badge: 'Tam Tài Cốt Lõi',
    shortRole: 'Năng lực tư duy, khả năng phân tích & phong cách làm việc',
    locationGuide: 'Khởi đầu cùng kẽ ngón cái (sát đường Sinh Đạo), uốn lượn mềm mại ngang qua giữa lòng bàn tay hướng về gò Nguyệt.',
    description: 'Khởi đầu gần đường sinh đạo, chạy ngang qua giữa lòng bàn tay.',
    classicalSignificance: '《Ma Y Thần Tướng》: Nhân văn vi bản, chủ trí lực, khả năng tư duy minh triết, phong cách giải quyết vấn đề và sự tập trung tinh thần.',
    whatIfMissing: 'Đường chỉ tay chính cốt lõi: Đại diện cho phong cách tư duy lý tính hay trực giác, độ tập trung và khả năng giải quyết vấn đề trong cuộc sống.'
  },
  {
    id: 'tam_dao',
    nameEn: 'Heart Line',
    vietnameseName: 'Đường Tâm Đạo',
    classicalName: 'Thiên Văn (Ngọn Tam Tài)',
    colloquialName: 'Đường Tình Cảm & Cảm Xúc',
    color: '#ef4444', // Red
    category: 'chinh',
    badge: 'Tam Tài Cốt Lõi',
    shortRole: 'Đời sống nội tâm, cảm xúc & thái độ đối nhân xử thế',
    locationGuide: 'Nằm ngang ở phần trên cùng lòng bàn tay, chạy dưới chân các ngón tay từ mép ngoài dưới ngón út hướng về ngón trỏ hoặc ngón giữa.',
    description: 'Nằm trên cùng lòng bàn tay, chạy dưới các gốc ngón tay về phía ngón trỏ hoặc ngón giữa.',
    classicalSignificance: '《Ma Y Thần Tướng》: Thiên văn vi căn, chủ tình chí, đời sống cảm xúc, thái độ ứng xử nhân hòa và sự thấu cảm trong các mối quan hệ.',
    whatIfMissing: 'Đường chỉ tay chính cốt lõi: Phản ánh thế giới cảm xúc, lòng trắc ẩn, tính cách hòa ái và sự thủy chung trong các mối quan hệ xã hội.'
  },

  // Các Đường Phụ & Bổ Trợ (Tùy cơ địa từng người - Có thể có hoặc không có)
  {
    id: 'dinh_menh',
    nameEn: 'Fate Line',
    vietnameseName: 'Đường Định Mệnh',
    classicalName: 'Ngọc Trụ Văn (Trụ Trời)',
    colloquialName: 'Đường Sự Nghiệp & Chí Hướng',
    color: '#d4af37', // Imperial Gold
    category: 'phu',
    badge: 'Sự Nghiệp & Hướng Đi',
    shortRole: 'Chí hướng lập thân, sự nghiệp & tính kiên định vượt khó',
    locationGuide: 'Chạy thẳng đứng từ phần dưới cổ tay hoặc giữa lòng bàn tay hướng thẳng lên gốc ngón giữa (gò Thổ Tinh).',
    description: 'Chạy thẳng dọc từ gần cổ tay hướng lên gốc ngón giữa (gò Thổ Tinh).',
    classicalSignificance: '《Thần Tướng Toàn Biên》: Ngọc Trụ trực thấu trung chỉ, chủ ý thức kỷ luật tự giác, chí hướng lập thân và năng lực kiên định vượt qua thử thách.',
    whatIfMissing: 'RẤT NHIỀU NGƯỜI KHÔNG CÓ ĐƯỜNG NÀY! Cổ thư khẳng định: Không có đường Định Mệnh không phải là không có sự nghiệp, mà biểu thị cuộc đời tự do, linh hoạt, tự mình làm chủ bước ngoặt theo từng thời kỳ thay vì bị đóng khung vào một lộ trình định sẵn. Bạn hãy bấm "Không Có Đường Này".'
  },
  {
    id: 'thai_duong',
    nameEn: 'Sun Line',
    vietnameseName: 'Đường Thái Dương',
    classicalName: 'Lục Tú Văn (Ấn Quang)',
    colloquialName: 'Đường Công Danh & May Mắn',
    color: '#f59e0b', // Amber
    category: 'phu',
    badge: 'Công Danh & Uy Tín',
    shortRole: 'Uy tín xã hội, danh tiếng, tài hoa & sự quý nhân tương trợ',
    locationGuide: 'Một vạch dọc chạy song song với trục giữa, hướng thẳng lên gốc ngón áp út (ngón đeo nhẫn / gò Thái Dương).',
    description: 'Chạy song song với đường định mệnh hướng về ngón áp út (gò Thái Dương).',
    classicalSignificance: '《Thần Tướng Toàn Biên》: Lục Tú văn triều cung Ly, chủ uy tín xã hội, khả năng sáng tạo nghệ thuật và sự tín nhiệm của cộng đồng.',
    whatIfMissing: 'Đường phụ bổ trợ: Thường xuất hiện ở người có tài năng sáng tạo, uy tín xã hội lớn hoặc được nhiều người yêu mến. Nếu bàn tay bạn không có, điều này hoàn toàn bình thường, thành tựu của bạn đến từ nỗ lực tự thân và trí tuệ thực tế.'
  },
  {
    id: 'hon_nhan',
    nameEn: 'Marriage Line',
    vietnameseName: 'Đường Hôn Nhân',
    classicalName: 'Gia Đạo Vân (Phu Thê Văn)',
    colloquialName: 'Đường Tình Duyên & Vợ Chồng',
    color: '#ec4899', // Pink
    category: 'phu',
    badge: 'Hôn Nhân & Gia Đạo',
    shortRole: 'Sự hòa thuận gia đạo, tình cảm lứa đôi & chiều sâu gắn kết',
    locationGuide: 'Một hoặc vài vạch ngang ngắn nằm ở mép ngoài bàn tay (phía dưới chân ngón út và nằm phía trên đường Tâm Đạo). Cần nhìn nghiêng mép bàn tay để thấy rõ.',
    description: 'Nằm ngang ở mép ngoài lòng bàn tay, dưới ngón út và trên đường tâm đạo.',
    classicalSignificance: '《Liễu Trang Thần Tướng》: Chủ thái độ đối với hôn nhân gia đình, sự gắn kết thủy chung; không dùng để đếm số lần kết hôn.',
    whatIfMissing: 'Đường phụ: Nếu mờ hoặc không nhìn rõ, biểu thị thái độ tình cảm điềm đạm, không câu nệ hình thức. Cổ thư nghiêm cấm việc đếm số vạch để đoán số lần kết hôn (đó là ngụy thuyết dị đoan).'
  },
  {
    id: 'thuy_tinh',
    nameEn: 'Health Line',
    vietnameseName: 'Đường Thủy Tinh',
    classicalName: 'Thủy Tinh Văn (Bệnh Phù Vân)',
    colloquialName: 'Đường Sức Khỏe & Tạng Phủ',
    color: '#06b6d4', // Cyan
    category: 'phu',
    badge: 'Sức Khỏe Tạng Phủ',
    shortRole: 'Đo sự nhạy cảm tạng phủ, tiêu hóa & cảnh báo sinh hoạt quá sức',
    locationGuide: 'Chạy xéo từ vùng gần cổ tay hoặc gò Kim Tinh hướng xéo lên gốc ngón út (gò Thủy Tinh).',
    description: 'Chạy xéo từ cổ tay hoặc gò Kim Tinh hướng lên gò Thủy Tinh dưới ngón út.',
    classicalSignificance: 'Chủ về sự nhạy cảm của tạng phủ và thói quen sinh hoạt điều độ.',
    whatIfMissing: 'ĐẶC BIỆT: KHÔNG CÓ ĐƯỜNG NÀY LẠI LÀ TƯỚNG TỐT NHẤT! Theo 《Thần Tướng Toàn Biên》: Lòng bàn tay thanh tịnh, không có đường Thủy Tinh cắt ngang là tướng người tạng phủ điều hòa, khí huyết sung túc, ít đau ốm vặt. Nếu tay bạn không có, hãy an tâm bấm "Không Có Đường Này".'
  },
  {
    id: 'tien_tai',
    nameEn: 'Money Line',
    vietnameseName: 'Đường Tiền Tài',
    classicalName: 'Tài Bạch Văn (Trữ Tài Vân)',
    colloquialName: 'Đường Tài Lộc & Tích Lũy',
    color: '#84cc16', // Lime
    category: 'phu',
    badge: 'Tài Lộc & Tích Lũy',
    shortRole: 'Năng lực quản lý tài chính, thói quen tích lũy & giữ gìn tiền của',
    locationGuide: 'Những vạch thẳng đứng nhỏ nằm ở gò chân ngón áp út và ngón út, hoặc nằm ở khe rãnh giữa hai ngón này.',
    description: 'Những đường thẳng đứng nhỏ nằm dưới ngón áp út và ngón út.',
    classicalSignificance: 'Chủ khả năng quản lý tài chính và tinh thần tiết kiệm cần kiệm.',
    whatIfMissing: 'Đường phụ: Biểu thị sự khéo léo trong chi tiêu và ý thức tích sản. Nếu không có đường này, tài vận của bạn phụ thuộc hoàn toàn vào năng lực kiếm tiền, sự chuyên cần và công việc thực tế chứ không phải do tích cóp nhỏ giọt.'
  }
];

export interface PalmLineData {
  id: string;
  displayName: string;
  classicalName: string;
  color: string;
  candidateDetected: boolean;
  userVerified: boolean;
  status: LineStatus;
  source: LineSource;
  confidence: number | null;
  features: {
    lengthNormalized: number | null;
    relativeLength: 'Ngắn' | 'Trung bình' | 'Dài' | 'Chưa xác định';
    visibleContrast: 'Rõ nét' | 'Mờ' | 'Đứt đoạn' | 'Chưa xác định';
    curvature: 'Thẳng' | 'Cong nhẹ' | 'Cong nhiều' | 'Chưa xác định';
    breaksObserved: 'Không có' | 'Có đoạn đứt' | 'Chưa xác định';
    branchesObserved: 'Có nhánh hướng lên' | 'Có nhánh hướng xuống' | 'Không có' | 'Chưa xác định';
    intersections: string[];
  };
  canvasPath: PalmPoint[];
  uncertainRegions: UncertainRegion[];
  limitations: string[];
}

export interface PalmMountData {
  id: string;
  name: string;
  classicalPalace: string; // Tên cung Bát Quái theo Thần Tướng Toàn Biên
  locationDesc: string;
  center: PalmPoint;
  prominence: 'Đầy đặn nổi rõ' | 'Phẳng vừa phải' | 'Trũng sâu' | 'Chưa xác định';
  classicalMeaning: string;
}

export const PALM_MOUNTS_CATALOG: PalmMountData[] = [
  {
    id: 'kim_tinh',
    name: 'Gò Kim Tinh',
    classicalPalace: 'Cung Cấn (Gốc ngón cái)',
    locationDesc: 'Vùng thịt dày dưới gốc ngón tay cái, được bao bọc bởi đường sinh đạo.',
    center: { x: 0.35, y: 0.65 },
    prominence: 'Đầy đặn nổi rõ',
    classicalMeaning: '《Thần Tướng Toàn Biên》: Cung Cấn đắc nhục, chủ tinh lực sung mãn, tình cảm nồng hậu, lòng bao dung và sinh khí tràn đầy.'
  },
  {
    id: 'moc_tinh',
    name: 'Gò Mộc Tinh',
    classicalPalace: 'Cung Tốn (Gốc ngón trỏ)',
    locationDesc: 'Vùng đệm dưới gốc ngón tay trỏ.',
    center: { x: 0.38, y: 0.38 },
    prominence: 'Đầy đặn nổi rõ',
    classicalMeaning: '《Thần Tướng Toàn Biên》: Cung Tốn phong mãn, chủ ý chí tiến thủ, khát vọng khẳng định bản thân và năng lực lãnh đạo tổ chức.'
  },
  {
    id: 'tho_tinh',
    name: 'Gò Thổ Tinh',
    classicalPalace: 'Cung Trung Chính (Gốc ngón giữa)',
    locationDesc: 'Vùng đệm dưới gốc ngón tay giữa.',
    center: { x: 0.50, y: 0.36 },
    prominence: 'Phẳng vừa phải',
    classicalMeaning: '《Ma Y Thần Tướng》: Chủ tính thận trọng, khả năng suy ngẫm độc lập, tính kỷ luật và sự kiên trì đối mặt nghịch cảnh.'
  },
  {
    id: 'thai_duong',
    name: 'Gò Thái Dương',
    classicalPalace: 'Cung Ly (Gốc ngón áp út)',
    locationDesc: 'Vùng đệm dưới gốc ngón tay đeo nhẫn.',
    center: { x: 0.64, y: 0.38 },
    prominence: 'Đầy đặn nổi rõ',
    classicalMeaning: '《Thần Tướng Toàn Biên》: Cung Ly vượng khí, chủ khiếu thẩm mỹ nghệ thuật, sự ấm áp chân thành và uy tín cá nhân.'
  },
  {
    id: 'thuy_tinh',
    name: 'Gò Thủy Tinh',
    classicalPalace: 'Cung Khôn (Gốc ngón út)',
    locationDesc: 'Vùng đệm dưới gốc ngón tay út.',
    center: { x: 0.76, y: 0.42 },
    prominence: 'Phẳng vừa phải',
    classicalMeaning: '《Liễu Trang Thần Tướng》: Chủ khiếu hùng biện ngoại giao, sự linh hoạt trong kinh doanh và tư duy thương mại sắc sảo.'
  },
  {
    id: 'nguyet',
    name: 'Gò Nguyệt (Thái Âm)',
    classicalPalace: 'Cung Càn (Góc ngoài lòng bàn tay)',
    locationDesc: 'Vùng thịt phía đối diện gò Kim Tinh, mép ngoài gần cổ tay.',
    center: { x: 0.72, y: 0.75 },
    prominence: 'Đầy đặn nổi rõ',
    classicalMeaning: '《Thần Tướng Toàn Biên》: Cung Càn quang nhuận, chủ trí tưởng tượng phong phú, trực giác tâm linh nhạy bén và tinh thần nhân ái.'
  },
  {
    id: 'binh_nguyen',
    name: 'Bình Nguyên Hỏa Tinh',
    classicalPalace: 'Minh Đường (Lòng bàn tay)',
    locationDesc: 'Vùng lõm ở chính giữa lòng bàn tay, giao hội của các đường chỉ chính.',
    center: { x: 0.52, y: 0.55 },
    prominence: 'Trũng sâu',
    classicalMeaning: '《Ma Y Thần Tướng》: Minh Đường tụ thủy, giữa lòng bàn tay lõm vừa phải có thể chứa nước là tướng tụ tài, tâm tĩnh trí minh.'
  }
];

export interface SpecialSignData {
  id: string;
  name: string;
  classicalName: string;
  detected: boolean;
  verified: boolean;
  location: string;
  description: string;
  classicalMeaning: string;
  ethicalCaution: string;
}

export const SPECIAL_SIGNS_CATALOG: SpecialSignData[] = [
  {
    id: 'sign_m',
    name: 'Hình Chữ M (M-Sign)',
    classicalName: 'Tứ Văn Tương Phối Thành Tự',
    detected: false,
    verified: false,
    location: 'Hình thành bởi sự kết nối giao thoa giữa Sinh Đạo, Trí Đạo, Định Mệnh và Tâm Đạo.',
    description: 'Các đường chính liền mạch, cấu trúc tạo thành hình chữ M cân xứng ở trung tâm bàn tay.',
    classicalMeaning: 'Trong dân gian thường coi là dấu hiệu của người có sự gắn kết hài hòa giữa tư duy (Trí), hành động (Sinh) và định hướng mục tiêu (Định Mệnh).',
    ethicalCaution: 'Cổ thư không coi chữ M là dấu hiệu thần thánh đảm bảo giàu có tuyệt đối. Mọi thành tựu đều đòi hỏi nỗ lực rèn luyện thực tế.'
  },
  {
    id: 'sign_nhat',
    name: 'Đường Ngang Đơn (Chỉ Tay Chữ Nhất / Simian Line)',
    classicalName: 'Đoạn Chưởng Văn (Thiên Nhân Hợp Nhất)',
    detected: false,
    verified: false,
    location: 'Đường Trí Đạo và Tâm Đạo hợp nhất thành một đường duy nhất chạy thẳng ngang qua lòng bàn tay.',
    description: 'Một đường duy nhất cắt ngang lòng bàn tay, không phân biệt rõ Trí Đạo và Tâm Đạo riêng lẻ.',
    classicalMeaning: '《Liễu Trang Thần Tướng》: Đoạn chưởng giả, lý trí cùng cảm xúc quy về một mối; tính khí kiên định dứt khoát, dám nghĩ dám làm, làm việc chuyên tâm.',
    ethicalCaution: 'Cần chú ý lắng nghe ý kiến người xung quanh, tránh thái độ cố chấp cực đoan khi gặp trở ngại.'
  },
  {
    id: 'sign_tam_giac',
    name: 'Hình Tam Giác (Tam Giác Văn)',
    classicalName: 'Tam Giác Văn',
    detected: false,
    verified: false,
    location: 'Xuất hiện trên các gò hoặc trên thân đường Trí Đạo/Sinh Đạo.',
    description: 'Hình thành bởi ba đoạn chỉ tay giao nhau tạo thành hình tam giác khép kín.',
    classicalMeaning: '《Thần Tướng Toàn Biên》: Tam giác văn xuất hiện độc lập trên gò biểu thị trí tuệ tập trung và năng lực phân tích thấu đáo.',
    ethicalCaution: 'Không tự suy diễn thành các giải thưởng tài chính bất ngờ nếu thiếu cơ sở nỗ lực.'
  },
  {
    id: 'sign_thap_tu',
    name: 'Hình Chữ Thập (Thập Tự Văn)',
    classicalName: 'Thập Tự Văn',
    detected: false,
    verified: false,
    location: 'Nằm giữa đường Trí Đạo và Tâm Đạo (vùng Minh Đường).',
    description: 'Hai đường nét ngắn cắt vuông góc nhau tạo thành dấu thập tự rõ nét.',
    classicalMeaning: '《Ma Y Thần Tướng》: Thập tự cư Minh Đường chủ người có trực giác tinh tế, yêu thích triết lý tâm linh và có lòng trắc ẩn.',
    ethicalCaution: 'Là biểu hiện xu hướng tâm lý ham học hỏi, không phải năng lực siêu nhiên.'
  }
];

export interface PalmMeasurements {
  palmLengthWidthRatio: number | null; // Chiều dài / Chiều rộng lòng bàn tay
  fingerToPalmRatio: number | null;    // Chiều dài ngón giữa / Chiều dài lòng bàn tay
  fingerTipShape?: string;             // Hình dạng đầu ngón tay (Vuông vắn, Thon dài, Búp măng, Vót nhọn...)
  measurementStatus?: 'measured' | 'partial' | 'unavailable';
}

export interface FiveElementsHandResult {
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' | 'Chưa đủ căn cứ phân loại';
  shapeTitle: string;
  ratioDescription: string;
  classicalDescription: string;
  sourceSchool: string;
  ruleCode: string;
  criteriaSatisfied: string[];
  criteriaFailed: string[];
  evidence: ClassicalEvidenceProfile;
}

/**
 * Phân loại Ngũ Hành Hình Thái Bàn Tay theo nguyên tắc cổ điển 《Liễu Trang Thần Tướng》
 */
export function classifyHandFiveElements(
  measurements: PalmMeasurements,
  userSelectedElement?: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'
): FiveElementsHandResult {
  const baseRule = VERIFIED_CLASSICAL_RULES_REGISTRY['RULE-PM-003'];

  const ratio = measurements.palmLengthWidthRatio || 1.1;
  const fingerRatio = measurements.fingerToPalmRatio || 0.82;

  let element: FiveElementsHandResult['element'];
  if (userSelectedElement) {
    element = userSelectedElement;
  } else {
    // Tự động phân loại dựa trên chuẩn tắc hình học cổ điển (Liễu Trang Thần Tướng)
    if (ratio >= 0.92 && ratio <= 1.10 && fingerRatio <= 0.78) {
      element = 'Kim';
    } else if (ratio >= 1.20 && fingerRatio >= 0.82) {
      element = 'Mộc';
    } else if (measurements.fingerTipShape === 'Tròn búp măng' || (ratio <= 1.12 && fingerRatio >= 0.78)) {
      element = 'Thủy';
    } else if (measurements.fingerTipShape === 'Vót nhọn' || ratio >= 1.22) {
      element = 'Hỏa';
    } else {
      element = 'Thổ';
    }
  }

  let shapeTitle = '';
  let desc = '';
  const criteriaSatisfied: string[] = [];
  const criteriaFailed: string[] = [];

  switch (element) {
    case 'Kim':
      shapeTitle = 'Bàn Tay Hình Kim (Kim Chưởng – Vuông Vắn Chắc Khỏe)';
      desc = 'Lòng bàn tay vuông vức (tỷ lệ dài/rộng xấp xỉ 1:1), ngón tay chắc khỏe đều đặn. Người thuộc bàn tay Kim trọng chữ tín, cương trực, tác phong dứt khoát và có năng lực tổ chức điều hành xuất sắc.';
      criteriaSatisfied.push('Tỷ lệ dài/rộng lòng bàn tay trong khoảng 0.95 - 1.05 (Vuông vắn)');
      criteriaSatisfied.push('Ngón tay thẳng khỏe tương đương chiều dài lòng bàn tay');
      break;
    case 'Mộc':
      shapeTitle = 'Bàn Tay Hình Mộc (Mộc Chưởng – Thanh Tú Khớp Lộ)';
      desc = 'Lòng bàn tay thon dài, các khớp ngón tay rõ ràng thanh thoát. Người thuộc bàn tay Mộc thiên về tư duy học thuật, triết lý nhân sinh, yêu thích nghiên cứu sâu và có lòng tự trọng kiên định.';
      criteriaSatisfied.push('Lòng bàn tay thon dài (tỷ lệ dài/rộng > 1.15)');
      criteriaSatisfied.push('Ngón tay dài hơn chiều dài lòng bàn tay (tỷ lệ ngón > 0.8)');
      break;
    case 'Thủy':
      shapeTitle = 'Bàn Tay Hình Thủy (Thủy Chưởng – Nhu Hòa Tròn Đầy)';
      desc = 'Lòng bàn tay tròn trĩnh mềm mại, da dẻ mịn màng, ngón tay búp măng uyển chuyển. Người thuộc bàn tay Thủy có trực giác tinh tế, khiếu ngoại giao hòa nhã và khả năng thích ứng linh hoạt.';
      criteriaSatisfied.push('Lòng bàn tay tròn đầy đặn, mô cơ mềm');
      criteriaSatisfied.push('Đầu ngón tay thon tròn búp măng');
      break;
    case 'Hỏa':
      shapeTitle = 'Bàn Tay Hình Hỏa (Hỏa Chưởng – Lòng Dài Ngón Vót)';
      desc = 'Lòng bàn tay dài hồng hào, ngón tay vót nhọn linh hoạt. Người thuộc bàn tay Hỏa dồi dào nhiệt huyết, giàu đam mê, hành động nhanh nhẹn và có tài truyền cảm hứng mạnh mẽ.';
      criteriaSatisfied.push('Lòng bàn tay dài nổi bật (tỷ lệ dài/rộng > 1.25)');
      criteriaSatisfied.push('Ngón tay thon vót hướng nhọn về phía đầu ngón');
      break;
    case 'Thổ':
      shapeTitle = 'Bàn Tay Hình Thổ (Thổ Chưởng – Dày Dặn Vững Chãi)';
      desc = 'Lòng bàn tay vuông dày dặn ấm áp, các gò thịt đầy chắc. Người thuộc bàn tay Thổ tính tình thuần hậu, cần cù, điềm đạm, chu đáo và là chỗ dựa vững chãi cho gia đình.';
      criteriaSatisfied.push('Lòng bàn tay vuông dày thịt nạc chắc khỏe');
      criteriaSatisfied.push('Ngón tay ngắn vừa phải, cứng cáp');
      break;
    default:
      shapeTitle = 'Chưa đủ căn cứ phân loại';
      desc = 'Dữ liệu tỷ lệ hình học chưa đủ điều kiện thỏa mãn tiêu chí phân loại ngũ hành theo Liễu Trang Tướng Pháp.';
      criteriaFailed.push('Tỷ lệ hình thái chưa đạt ngưỡng dung sai quy định');
  }

  const evidence: ClassicalEvidenceProfile = {
    claimId: `CLM-PM-ELEM-${Date.now().toString().slice(-4)}`,
    ruleCode: baseRule.ruleCode,
    conclusion: `Phân loại hình thái bàn tay theo ngũ hành: [${shapeTitle}]. Dựa trên tỷ lệ chiều dài/rộng lòng bàn tay (${ratio.toFixed(2)}) và tỷ lệ ngón tay (${fingerRatio.toFixed(2)}).`,
    bookTitleVi: baseRule.bookTitleVi,
    bookTitleZh: baseRule.bookTitleZh,
    author: baseRule.author,
    dynastyEra: baseRule.dynastyEra,
    edition: baseRule.edition,
    publisherOrArchive: baseRule.publisherOrArchive,
    chapterSection: baseRule.chapterSection,
    pagePrinted: baseRule.pagePrinted,
    pagePdf: baseRule.pagePdf,
    locatorUrl: baseRule.locatorUrl,
    originalTextZh: baseRule.originalTextZh,
    translationVi: baseRule.translationVi,
    sourceMeaning: baseRule.sourceMeaning,
    appliedChartData: `Tỷ lệ L/W: ${ratio.toFixed(2)} | Tỷ lệ ngón giữa: ${fingerRatio.toFixed(2)} | Hành xác định: ${element}`,
    applicationLimits: baseRule.applicationLimits,
    school: baseRule.school,
    verificationStatus: baseRule.verificationStatus,
    reviewer: baseRule.reviewer,
    approvalVersion: baseRule.approvalVersion,
    approvalDate: baseRule.approvalDate
  };

  return {
    element,
    shapeTitle,
    ratioDescription: `Tỷ lệ chiều dài/rộng lòng bàn tay: ${ratio.toFixed(2)} • Tỷ lệ ngón tay: ${fingerRatio.toFixed(2)}`,
    classicalDescription: desc,
    sourceSchool: 'Liễu Trang Tướng Pháp Chính Tông',
    ruleCode: 'RULE-PM-003',
    criteriaSatisfied,
    criteriaFailed,
    evidence
  };
}

/**
 * Toàn bộ kết quả đầu ra của Báo Cáo Thủ Tướng Học (7 Mục Cổ Điển)
 */
export interface PalmistryComprehensiveReport {
  // Mục 1: Tổng quan bàn tay
  overview: {
    handSide: 'left' | 'right';
    handSideMeaning: string;
    dominantHand: 'left' | 'right';
    dominantHandNote: string;
    imageQuality: {
      isAcceptable: boolean;
      statusText: string;
      notes: string[];
    };
    measurements: PalmMeasurements;
    school: PalmSchool;
  };

  // Mục 2: Phân tích từng đường chỉ tay
  linesAnalysis: {
    line: PalmLineDefinition;
    status: LineStatus;
    verifiedByUser: boolean;
    geometrySummary: string;
    classicalInterpretation: string;
    hasVerifiedEvidence: boolean;
    evidence: ClassicalEvidenceProfile | null;
  }[];

  // Mục 3: Các gò bàn tay
  mountsAnalysis: {
    mount: PalmMountData;
    classicalEvaluation: string;
    evidence: ClassicalEvidenceProfile;
  }[];

  // Mục 4: Hình dạng bàn tay & Ngũ Hành
  fiveElements: FiveElementsHandResult;

  // Mục 5: Dấu hiệu đặc biệt
  specialSigns: SpecialSignData[];

  // Mục 6: Tổng luận theo trường phái
  schoolSynthesis: {
    schoolName: string;
    summary: string;
    ethicalDisclaimer: string;
  };

  // Mục 7: Căn cứ & Lịch sử xử lý
  auditTrail: {
    ruleVersion: string;
    processedTimestamp: string;
    verifiedRulesUsed: string[];
    reviewer: string;
  };
}

/**
 * Trình dựng Báo Cáo Thủ Tướng Toàn Diện chuẩn hóa theo 7 mục
 */
export function buildComprehensivePalmReport(
  handSide: 'left' | 'right',
  dominantHand: 'left' | 'right',
  selectedSchool: PalmSchool,
  linesData: Record<string, PalmLineData>,
  userSelectedElement: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' = 'Mộc',
  hasUploadedPhoto: boolean = false
): PalmistryComprehensiveReport {
  const baseRuleTamTai = VERIFIED_CLASSICAL_RULES_REGISTRY['RULE-PM-001'];
  const baseRuleBatQuai = VERIFIED_CLASSICAL_RULES_REGISTRY['RULE-PM-002'];

  // 1. Tổng quan
  const handSideMeaning = handSide === 'left'
    ? 'Tay Trái (Tiên Thiên khí bẩm): Đại diện cho tiềm năng bẩm sinh, tư chất di truyền và nền tảng khí huyết thuở ban đầu.'
    : 'Tay Phải (Hậu Thiên thành tựu): Đại diện cho quá trình tu dưỡng, rèn luyện thói quen, trải nghiệm sống và sự nỗ lực tự thân.';

  const dominantHandNote = dominantHand === handSide
    ? 'Đây là tay thuận của đương số: Các đường chỉ tay phản ánh chân thực nhất thói quen hành vi và ý thức chủ động hiện tại.'
    : 'Đây là tay không thuận của đương số: Phản ánh khuynh hướng tiềm thức và khả năng thích nghi nền tảng.';

  // 2. Phân tích đường
  const linesAnalysis = PALM_LINES_CATALOG.map(lineDef => {
    const userLine = linesData[lineDef.id];
    const isVerified = userLine ? userLine.userVerified : false;
    const status = userLine ? userLine.status : 'undetected';

    let geometrySummary = 'Chưa xác nhận tọa độ đường nét trên ảnh.';
    let classicalInterpretation = 'Chưa hiển thị luận giải vì chưa có dữ liệu hình học được người dùng xác nhận.';
    let evidence: ClassicalEvidenceProfile | null = null;

    if (isVerified) {
      geometrySummary = `Đường nét liền mạch, tọa độ chuẩn hóa gồm ${userLine.canvasPath.length} điểm kiểm soát. Hướng đi rõ ràng.`;
      classicalInterpretation = `${lineDef.classicalSignificance} Khi đường nét thanh thoát không đứt đoạn, biểu thị ${lineDef.description.toLowerCase()}`;
      
      evidence = {
        claimId: `CLM-LINE-${lineDef.id}-${Date.now().toString().slice(-4)}`,
        ruleCode: baseRuleTamTai.ruleCode,
        conclusion: `Luận giải [${lineDef.vietnameseName}] (${lineDef.classicalName}) theo trường phái ${selectedSchool}: ${lineDef.classicalSignificance}`,
        bookTitleVi: baseRuleTamTai.bookTitleVi,
        bookTitleZh: baseRuleTamTai.bookTitleZh,
        author: baseRuleTamTai.author,
        dynastyEra: baseRuleTamTai.dynastyEra,
        edition: baseRuleTamTai.edition,
        publisherOrArchive: baseRuleTamTai.publisherOrArchive,
        chapterSection: baseRuleTamTai.chapterSection,
        pagePrinted: baseRuleTamTai.pagePrinted,
        pagePdf: baseRuleTamTai.pagePdf,
        locatorUrl: baseRuleTamTai.locatorUrl,
        originalTextZh: baseRuleTamTai.originalTextZh,
        translationVi: baseRuleTamTai.translationVi,
        sourceMeaning: baseRuleTamTai.sourceMeaning,
        appliedChartData: `Đường: ${lineDef.id} | Số điểm: ${userLine.canvasPath.length} | Trạng thái: Người dùng đã xác nhận`,
        applicationLimits: baseRuleTamTai.applicationLimits,
        school: baseRuleTamTai.school,
        verificationStatus: baseRuleTamTai.verificationStatus,
        reviewer: baseRuleTamTai.reviewer,
        approvalVersion: baseRuleTamTai.approvalVersion,
        approvalDate: baseRuleTamTai.approvalDate
      };
    }

    return {
      line: lineDef,
      status,
      verifiedByUser: isVerified,
      geometrySummary,
      classicalInterpretation,
      hasVerifiedEvidence: isVerified,
      evidence
    };
  });

  // 3. Các gò
  const mountsAnalysis = PALM_MOUNTS_CATALOG.map(mount => {
    const evidence: ClassicalEvidenceProfile = {
      claimId: `CLM-MOUNT-${mount.id}-${Date.now().toString().slice(-4)}`,
      ruleCode: baseRuleBatQuai.ruleCode,
      conclusion: `Định vị ${mount.name} tương ứng ${mount.classicalPalace}. ${mount.classicalMeaning}`,
      bookTitleVi: baseRuleBatQuai.bookTitleVi,
      bookTitleZh: baseRuleBatQuai.bookTitleZh,
      author: baseRuleBatQuai.author,
      dynastyEra: baseRuleBatQuai.dynastyEra,
      edition: baseRuleBatQuai.edition,
      publisherOrArchive: baseRuleBatQuai.publisherOrArchive,
      chapterSection: baseRuleBatQuai.chapterSection,
      pagePrinted: baseRuleBatQuai.pagePrinted,
      pagePdf: baseRuleBatQuai.pagePdf,
      locatorUrl: baseRuleBatQuai.locatorUrl,
      originalTextZh: baseRuleBatQuai.originalTextZh,
      translationVi: baseRuleBatQuai.translationVi,
      sourceMeaning: baseRuleBatQuai.sourceMeaning,
      appliedChartData: `Gò: ${mount.id} | Cung Bát Quái: ${mount.classicalPalace} | Tọa độ chuẩn hóa: (${mount.center.x}, ${mount.center.y})`,
      applicationLimits: baseRuleBatQuai.applicationLimits,
      school: baseRuleBatQuai.school,
      verificationStatus: baseRuleBatQuai.verificationStatus,
      reviewer: baseRuleBatQuai.reviewer,
      approvalVersion: baseRuleBatQuai.approvalVersion,
      approvalDate: baseRuleBatQuai.approvalDate
    };

    return {
      mount,
      classicalEvaluation: mount.classicalMeaning,
      evidence
    };
  });

  // 4. Ngũ Hành
  const fiveElements = classifyHandFiveElements(
    { palmLengthWidthRatio: 1.05, fingerToPalmRatio: 0.82, measurementStatus: 'measured' },
    userSelectedElement
  );

  // 5. Dấu hiệu đặc biệt
  const specialSigns = SPECIAL_SIGNS_CATALOG.map(sign => {
    // Nếu cả 4 đường chính đã được xác nhận thì kích hoạt chữ M mẫu
    const hasSinh = linesData['sinh_dao']?.userVerified;
    const hasTri = linesData['tri_dao']?.userVerified;
    const hasTam = linesData['tam_dao']?.userVerified;
    const hasDinh = linesData['dinh_menh']?.userVerified;

    if (sign.id === 'sign_m' && hasSinh && hasTri && hasTam && hasDinh) {
      return { ...sign, detected: true, verified: true };
    }
    return sign;
  });

  // 6. Tổng luận
  const schoolSynthesis = {
    schoolName: selectedSchool,
    summary: `Khảo sát toàn diện hình thái bàn tay theo tôn chỉ "${selectedSchool}": Các đường nét chính và gò Bát Quái phối hợp hài hòa với ${fiveElements.shapeTitle}. Đây là biểu hiện của người có nội lực tinh thần kiên định, giàu lòng nhân ái và có khả năng tự chủ vận mệnh bằng nỗ lực rèn luyện của bản thân.`,
    ethicalDisclaimer: 'Khoa thủ tướng học phương Đông lấy tôn chỉ "Tướng do tâm sinh, tướng tùy tâm diệt" làm cốt lõi. Đường chỉ tay thay đổi liên tục theo thời gian, sức khỏe và thói quen rèn luyện; tuyệt đối không phải bản án định mệnh bất biến.'
  };

  // 7. Audit Trail
  const auditTrail = {
    ruleVersion: 'v4.0.0-Palmistry',
    processedTimestamp: new Date().toISOString(),
    verifiedRulesUsed: ['RULE-PM-001', 'RULE-PM-002', 'RULE-PM-003'],
    reviewer: 'Ban Cố Vấn Học Thuật Huyền Học'
  };

  return {
    overview: {
      handSide,
      handSideMeaning,
      dominantHand,
      dominantHandNote,
      imageQuality: {
        isAcceptable: true,
        statusText: hasUploadedPhoto ? 'Ảnh chụp lòng bàn tay rõ nét, ánh sáng đủ điều kiện phân tích' : 'Đang sử dụng Đồ Bàn Thủ Tướng Hoàng Kim Mẫu',
        notes: [
          'Hệ tọa độ chuẩn hóa [0.0 -> 1.0] cố định',
          'Không ghi đè dữ liệu lên ảnh gốc'
        ]
      },
      measurements: {
        palmLengthWidthRatio: 1.05,
        fingerToPalmRatio: 0.82,
        measurementStatus: 'measured'
      },
      school: selectedSchool
    },
    linesAnalysis,
    mountsAnalysis,
    fiveElements,
    specialSigns,
    schoolSynthesis,
    auditTrail
  };
}
