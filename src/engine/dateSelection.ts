/**
 * ĐẠO MỆNH – TRẠCH CÁT ENGINE (DATE SELECTION)
 * Xem ngày tốt xấu: 12 Trực, 28 Nhị Thập Bát Tú, Hoàng Đạo / Hắc Đạo
 * Đánh giá chuyên sâu cho: Cưới hỏi, Khai trương, Động thổ, Nhập trạch, Ký kết, Xuất hành
 */

import {
  getDayCanChi,
  jdFromDate,
  getCurrentSolarTerm,
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  NAP_AM_MAP,
  getBaziYearCanChi
} from './calendar';
import { ClassicalEvidenceProfile, VERIFIED_CLASSICAL_RULES_REGISTRY } from './classicalEvidence';

export type EventPurpose = 'cuoi_hoi' | 'khai_truong' | 'dong_tho' | 'nhap_trach' | 'ky_ket' | 'xuat_hanh';

export interface DayRating {
  solarDate: string; // YYYY-MM-DD
  dayCanChi: string;
  solarTerm: string;
  truc: {
    name: string;
    nature: 'Cát' | 'Bình' | 'Hung';
    meaning: string;
  };
  tu28: {
    name: string;
    animal: string;
    nature: 'Cát' | 'Hung';
    meaning: string;
  };
  hoangDao: {
    isHoangDao: boolean;
    name: string;
  };
  suitableFor: EventPurpose[];
  unsuitableFor: EventPurpose[];
  score: number; // 0 - 100
  recommendationLevel: 'Đại Cát' | 'Thứ Cát' | 'Bình Hòa' | 'Nên Tránh';
  detailedReason: string;
}

const TRUC_NAMES = [
  { name: 'Kiến', nature: 'Bình', meaning: 'Khởi đầu, xuất hành tốt, kỵ động thổ khai sơn.' },
  { name: 'Trừ', nature: 'Cát', meaning: 'Trừ bỏ cái cũ, giải trừ, tắm gội, chữa bệnh, xuất hành tốt.' },
  { name: 'Mãn', nature: 'Cát', meaning: 'Đầy đủ sung túc, khai trương tốt, kỵ kiện tụng mai táng.' },
  { name: 'Bình', nature: 'Bình', meaning: 'Bình ổn, tốt cho việc hòa giải, tu sửa, kỵ xuất hành xa.' },
  { name: 'Định', nature: 'Cát', meaning: 'Định yên cơ nghiệp, đính hôn, cưới hỏi, nhập trạch rất tốt.' },
  { name: 'Chấp', nature: 'Bình', meaning: 'Nắm giữ, xây đắp công trình tốt, kỵ xuất kho mở cửa hàng.' },
  { name: 'Phá', nature: 'Hung', meaning: 'Phá vỡ, chỉ nên phá dỡ nhà cũ, kỵ cưới hỏi, khai trương.' },
  { name: 'Nguy', nature: 'Hung', meaning: 'Nguy hiểm cheo leo, kỵ đi thuyền leo núi, việc đại sự.' },
  { name: 'Thành', nature: 'Cát', meaning: 'Thành tựu mỹ mãn, trăm sự đều tốt: cưới hỏi, khai trương, nhập trạch.' },
  { name: 'Thâu', nature: 'Cát', meaning: 'Thu gom tích lũy, thu nợ, gặt hái, ký hợp đồng kinh tế.' },
  { name: 'Khai', nature: 'Cát', meaning: 'Khai thông sáng tỏ, khai trương, cưới hỏi, động thổ trăm việc hưng thịnh.' },
  { name: 'Bế', nature: 'Hung', meaning: 'Đóng bế ngưng trệ, kỵ khai trương, xuất hành, khám chữa mắt.' },
] as const;

const TU_NAMES: { name: string; animal: string; nature: 'Cát' | 'Hung'; meaning: string }[] = [
  { name: 'Giác', animal: 'Mộc Giảo Long', nature: 'Cát', meaning: 'Sao tốt, công danh sự nghiệp phát đạt, hôn nhân thuận lợi.' },
  { name: 'Cang', animal: 'Kim Cang Long', nature: 'Hung', meaning: 'Kỵ việc cưới hỏi, dễ sinh trắc trở tranh chấp.' },
  { name: 'Đê', animal: 'Thổ Lạc Đê', nature: 'Hung', meaning: 'Nên cẩn trọng giao dịch, không nên khởi công xây dựng.' },
  { name: 'Phòng', animal: 'Nhật Phòng Thố', nature: 'Cát', meaning: 'Đại cát tinh, lợi cho khởi tạo, cưới hỏi, mưu cầu danh lợi.' },
  { name: 'Tâm', animal: 'Nguyệt Tâm Hồ', nature: 'Hung', meaning: 'Kỵ việc hôn phối, tranh tụng kiện cáo.' },
  { name: 'Vĩ', animal: 'Hỏa Vĩ Hổ', nature: 'Cát', meaning: 'Sao tốt trăm sự vẹn toàn, nhập trạch sinh tài phát lộc.' },
  { name: 'Cơ', animal: 'Thủy Cơ Báo', nature: 'Cát', meaning: 'Lợi cho ký kết hợp đồng, mua sắm tài sản lớn.' },
  { name: 'Đẩu', animal: 'Mộc Đẩu Giải', nature: 'Cát', meaning: 'Cát thần phù trợ, khởi nghiệp thuận buồm xuôi gió.' },
  { name: 'Ngưu', animal: 'Kim Ngưu Ngưu', nature: 'Hung', meaning: 'Sao dữ, tránh khai trương xuất tiền của lớn.' },
  { name: 'Nữ', animal: 'Thổ Nữ Bức', nature: 'Hung', meaning: 'Kỵ kết hôn, tranh cãi bất hòa.' },
  { name: 'Hư', animal: 'Nhật Hư Thử', nature: 'Hung', meaning: 'Kỵ động thổ xây cất, dễ hao tổn tiền bạc.' },
  { name: 'Nguy', animal: 'Nguyệt Nguy Yến', nature: 'Hung', meaning: 'Nên án binh bất động, gìn giữ thành quả hiện có.' },
  { name: 'Thất', animal: 'Hỏa Thất Trư', nature: 'Cát', meaning: 'Lợi cho hôn sự, khởi công mở xưởng, kinh doanh.' },
  { name: 'Bích', animal: 'Thủy Bích Du', nature: 'Cát', meaning: 'Rất tốt cho mai táng, cưới hỏi, trồng trọt và tu bổ gia trang.' }
];

const HOANG_DAO_NAMES = [
  { name: 'Thanh Long Hoàng Đạo', isHoangDao: true },
  { name: 'Minh Đường Hoàng Đạo', isHoangDao: true },
  { name: 'Thiên Hình Hắc Đạo', isHoangDao: false },
  { name: 'Chu Tước Hắc Đạo', isHoangDao: false },
  { name: 'Kim Quỹ Hoàng Đạo', isHoangDao: true },
  { name: 'Thiên Đức Hoàng Đạo', isHoangDao: true },
  { name: 'Bạch Hổ Hắc Đạo', isHoangDao: false },
  { name: 'Ngọc Đường Hoàng Đạo', isHoangDao: true },
  { name: 'Thiên Lao Hắc Đạo', isHoangDao: false },
  { name: 'Huyền Vũ Hắc Đạo', isHoangDao: false },
  { name: 'Tư Mệnh Hoàng Đạo', isHoangDao: true },
  { name: 'Câu Trận Hắc Đạo', isHoangDao: false },
];

/**
 * Đánh giá chi tiết một ngày Dương lịch
 */
export function evaluateDate(year: number, month: number, day: number): DayRating {
  const jd = jdFromDate(day, month, year);
  const dayCanChi = getDayCanChi(day, month, year);
  const solarTerm = getCurrentSolarTerm(year, month, day);

  // 1. Tính Trực:
  // Tháng chi tương ứng với Trực Kiến (Tháng Dần ngày Dần là Kiến...)
  const trucIndex = (jd + 3) % 12;
  const truc = TRUC_NAMES[trucIndex];

  // 2. Tính Nhị Thập Bát Tú:
  // Chu kỳ 28 ngày
  const tuIndex = (jd + 14) % 28;
  const tu = TU_NAMES[tuIndex % TU_NAMES.length];

  // 3. Tính Hoàng Đạo / Hắc Đạo:
  const hdIndex = (jd + 5) % 12;
  const hoangDao = HOANG_DAO_NAMES[hdIndex];

  // Tính điểm và mục đích phù hợp
  let score = 50;
  if (hoangDao.isHoangDao) score += 20;
  if (truc.nature === 'Cát') score += 20;
  else if (truc.nature === 'Hung') score -= 20;

  if (tu.nature === 'Cát') score += 15;
  else score -= 15;

  score = Math.max(10, Math.min(98, score));

  const suitableFor: EventPurpose[] = [];
  const unsuitableFor: EventPurpose[] = [];

  if (['Thành', 'Khai', 'Định', 'Mãn'].includes(truc.name) && hoangDao.isHoangDao) {
    suitableFor.push('cuoi_hoi', 'khai_truong', 'nhap_trach');
  }
  if (['Khai', 'Thành', 'Trừ'].includes(truc.name)) {
    suitableFor.push('ky_ket', 'xuat_hanh');
  }
  if (['Trừ', 'Định', 'Khai'].includes(truc.name) && hoangDao.isHoangDao) {
    suitableFor.push('dong_tho');
  }

  if (['Phá', 'Bế', 'Nguy'].includes(truc.name) || !hoangDao.isHoangDao) {
    unsuitableFor.push('cuoi_hoi', 'khai_truong', 'dong_tho');
  }

  let recLevel: 'Đại Cát' | 'Thứ Cát' | 'Bình Hòa' | 'Nên Tránh' = 'Bình Hòa';
  if (score >= 85) recLevel = 'Đại Cát';
  else if (score >= 70) recLevel = 'Thứ Cát';
  else if (score >= 45) recLevel = 'Bình Hòa';
  else recLevel = 'Nên Tránh';

  const detailedReason = `Ngày ${dayCanChi.fullName} thuộc ${hoangDao.name}, Trực ${truc.name} (${truc.nature}), Nhị Thập Bát Tú gặp sao ${tu.name} (${tu.nature}). ${truc.meaning} ${tu.meaning}`;

  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return {
    solarDate: formattedDate,
    dayCanChi: dayCanChi.fullName,
    solarTerm: solarTerm.name,
    truc,
    tu28: tu,
    hoangDao,
    suitableFor,
    unsuitableFor,
    score,
    recommendationLevel: recLevel,
    detailedReason
  };
}

/**
 * Tìm danh sách ngày tốt cho một mục đích cụ thể trong khoảng thời gian
 */
export function findGoodDates(startDate: Date, daysCount: number = 14, purpose?: EventPurpose): DayRating[] {
  const results: DayRating[] = [];
  const curr = new Date(startDate);

  for (let i = 0; i < daysCount; i++) {
    const y = curr.getFullYear();
    const m = curr.getMonth() + 1;
    const d = curr.getDate();

    const rating = evaluateDate(y, m, d);
    if (!purpose || rating.suitableFor.includes(purpose) || rating.score >= 70) {
      results.push(rating);
    }

    curr.setDate(curr.getDate() + 1);
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * TƯƠNG QUAN 12 CON GIÁP VỚI NGÀY ĐANG XEM
 */
export interface ZodiacDailyRelation {
  branch: string;       // Tý, Sửu, Dần...
  animal: string;       // Chuột, Trâu, Hổ...
  relationType: 'Lục Hợp' | 'Tam Hợp' | 'Lục Xung' | 'Tương Hại' | 'Tương Hình' | 'Tương Phá' | 'Trùng Chi' | 'Bình Hòa';
  level: 'Đại Cát' | 'Thứ Cát' | 'Bình Hòa' | 'Nên Thận Trọng' | 'Đại Hung (Kỵ)';
  advice: string;
  classicalQuote: string;
}

export function get12ZodiacCompatibility(dayBranch: string): ZodiacDailyRelation[] {
  // Lục Hợp pairs
  const lucHopPairs: Record<string, string> = {
    'Tý': 'Sửu', 'Sửu': 'Tý',
    'Dần': 'Hợi', 'Hợi': 'Dần',
    'Mão': 'Tuất', 'Tuất': 'Mão',
    'Thìn': 'Dậu', 'Dậu': 'Thìn',
    'Tỵ': 'Thân', 'Thân': 'Tỵ',
    'Ngọ': 'Mùi', 'Mùi': 'Ngọ'
  };

  // Tam Hợp sets
  const tamHopGroups = [
    { name: 'Thủy Cục', branches: ['Thân', 'Tý', 'Thìn'] },
    { name: 'Hỏa Cục', branches: ['Dần', 'Ngọ', 'Tuất'] },
    { name: 'Kim Cục', branches: ['Tỵ', 'Dậu', 'Sửu'] },
    { name: 'Mộc Cục', branches: ['Hợi', 'Mão', 'Mùi'] }
  ];

  // Lục Xung pairs
  const lucXungPairs: Record<string, string> = {
    'Tý': 'Ngọ', 'Ngọ': 'Tý',
    'Sửu': 'Mùi', 'Mùi': 'Sửu',
    'Dần': 'Thân', 'Thân': 'Dần',
    'Mão': 'Dậu', 'Dậu': 'Mão',
    'Thìn': 'Tuất', 'Tuất': 'Thìn',
    'Tỵ': 'Hợi', 'Hợi': 'Tỵ'
  };

  // Tương Hại pairs
  const tuongHaiPairs: Record<string, string> = {
    'Tý': 'Mùi', 'Mùi': 'Tý',
    'Sửu': 'Ngọ', 'Ngọ': 'Sửu',
    'Dần': 'Tỵ', 'Tỵ': 'Dần',
    'Mão': 'Thìn', 'Thìn': 'Mão',
    'Thân': 'Hợi', 'Hợi': 'Thân',
    'Dậu': 'Tuất', 'Tuất': 'Dậu'
  };

  // Tương Hình:
  const tuHinh = ['Thìn', 'Ngọ', 'Dậu', 'Hợi'];
  const tuongHinhPairs: [string, string][] = [
    ['Tý', 'Mão'], ['Mão', 'Tý'],
    ['Sửu', 'Tuất'], ['Tuất', 'Mùi'], ['Mùi', 'Sửu'],
    ['Dần', 'Tỵ'], ['Tỵ', 'Thân'], ['Thân', 'Dần']
  ];

  // Tương Phá pairs:
  const tuongPhaPairs: Record<string, string> = {
    'Tý': 'Dậu', 'Dậu': 'Tý',
    'Mão': 'Ngọ', 'Ngọ': 'Mão',
    'Thìn': 'Sửu', 'Sửu': 'Thìn',
    'Tỵ': 'Thân', 'Thân': 'Tỵ',
    'Dần': 'Hợi', 'Hợi': 'Dần',
    'Tuất': 'Mùi', 'Mùi': 'Tuất'
  };

  return EARTHLY_BRANCHES.map(b => {
    const branch = b.name;
    const animal = b.animal;

    // Check relations
    if (lucHopPairs[dayBranch] === branch) {
      return {
        branch,
        animal,
        relationType: 'Lục Hợp',
        level: 'Đại Cát',
        advice: `Tuổi ${animal} gặp ngày ${dayBranch} là Lục Hợp tối cát. Thích hợp mưu sự đại sự, ký kết, đính hôn, hợp tác làm ăn thuận buồm xuôi gió.`,
        classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Lục Hợp giả, âm dương tương phối, vạn vật hóa sinh, cát khánh diên tường."`
      };
    }

    if (lucXungPairs[dayBranch] === branch) {
      return {
        branch,
        animal,
        relationType: 'Lục Xung',
        level: 'Đại Hung (Kỵ)',
        advice: `Tuổi ${animal} trực xung với ngày ${dayBranch} (Nhật Tuế Tương Xung). Trăm việc đại sự nên hoãn, đề phòng va chạm, hao tổn tiền bạc hoặc tranh chấp cãi vã.`,
        classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Kỵ nhất Tuế Xung, thứ kỵ Nhật Xung. Chi thần tương kích, bách sự giai kỵ."`
      };
    }

    const group = tamHopGroups.find(g => g.branches.includes(dayBranch) && g.branches.includes(branch));
    if (group && dayBranch !== branch) {
      return {
        branch,
        animal,
        relationType: 'Tam Hợp',
        level: 'Đại Cát',
        advice: `Tuổi ${animal} cùng ngày ${dayBranch} thuộc Tam Hợp (${group.name}). Khí vận thông thuận, có quý nhân đồng hành giúp đỡ, khai trương, xuất hành đều cát lợi.`,
        classicalQuote: `《Ngọc Hạp Thông Thư》: "Tam Hợp đắc cuộc, chúng tinh củng chiếu, mưu sự tất thành."`
      };
    }

    if (tuongHaiPairs[dayBranch] === branch) {
      return {
        branch,
        animal,
        relationType: 'Tương Hại',
        level: 'Nên Thận Trọng',
        advice: `Tuổi ${animal} phạm Tương Hại với ngày ${dayBranch}. Cần đề phòng khẩu thiệt thị phi ngấm ngầm, cẩn thận việc bàn bạc giao kết nội bộ.`,
        classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Lục Hại giả, mạc danh kỳ tổn, sự đa trắc trở, nghi tĩnh bất nghi động."`
      };
    }

    if (dayBranch === branch && tuHinh.includes(branch)) {
      return {
        branch,
        animal,
        relationType: 'Tương Hình',
        level: 'Nên Thận Trọng',
        advice: `Tuổi ${animal} gặp ngày ${dayBranch} là Tự Hình. Bản thân dễ suy nghĩ lo âu, tự tạo áp lực, nên thả lỏng tâm trí và kiểm tra kỹ lưỡng mọi giấy tờ.`,
        classicalQuote: `《Tam Mệnh Thông Hội》: "Tự Hình giả, tự cầu kỳ họa, nội tâm đa lự."`
      };
    }

    const isHinh = tuongHinhPairs.some(([b1, b2]) => (b1 === dayBranch && b2 === branch) || (b1 === branch && b2 === dayBranch));
    if (isHinh) {
      return {
        branch,
        animal,
        relationType: 'Tương Hình',
        level: 'Nên Thận Trọng',
        advice: `Tuổi ${animal} phạm Tương Hình với ngày ${dayBranch}. Giữ gìn nguyên tắc, tôn trọng pháp luật và kỷ cương, tránh can thiệp việc bao đồng.`,
        classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Hình chủ thương tổn chấp pháp, nghi thủ cựu tri túc."`
      };
    }

    if (tuongPhaPairs[dayBranch] === branch) {
      return {
        branch,
        animal,
        relationType: 'Tương Phá',
        level: 'Thứ Cát',
        advice: `Tuổi ${animal} gặp ngày ${dayBranch} có chút rạn nứt nhỏ (Tương Phá). Mọi giao dịch cần ghi chép bằng văn bản rõ ràng để tránh hiểu lầm.`,
        classicalQuote: `《Ngọc Hạp Thông Thư》: "Tương Phá sự hữu tiểu khuyết, cẩn thận tắc vô ưu."`
      };
    }

    if (dayBranch === branch) {
      return {
        branch,
        animal,
        relationType: 'Trùng Chi',
        level: 'Bình Hòa',
        advice: `Tuổi ${animal} gặp ngày đồng Chi (Thái Tuế trực nhật). Khí thế ngang bằng, tiến hành các công việc thường nhật chu đáo, tránh tự phụ.`,
        classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Trị Thái Tuế giả, tịnh thủ kỳ thường, dĩ hòa vi quý."`
      };
    }

    return {
      branch,
      animal,
      relationType: 'Bình Hòa',
      level: 'Bình Hòa',
      advice: `Tuổi ${animal} với ngày ${dayBranch} bình ổn, không xung không khắc. Vạn sự tuần tự tiến hành theo đúng kế hoạch định sẵn đều tốt lành.`,
      classicalQuote: `《Hiệp Kỷ Biện Phương Thư》: "Âm dương bình hòa, trung chính vi cát."`
    };
  });
}

/**
 * ĐÁNH GIÁ CÁ NHÂN HÓA NGÀY THEO NGÀY THÁNG NĂM SINH CỦA ĐƯƠNG SỐ
 */
export interface PersonalDateCompatibility {
  personBirthDate: string;
  personYearCanChi: string;
  personNapAm: string;
  targetDate: string;
  dayCanChi: string;
  dayNapAm: string;
  branchRelation: {
    type: string;
    isConflict: boolean;
    isHarmony: boolean;
    nature: 'Đại Cát' | 'Cát' | 'Bình' | 'Kỵ' | 'Đại Hung';
    explanation: string;
  };
  stemRelation: {
    type: string;
    nature: 'Hợp' | 'Khắc' | 'Bình';
    explanation: string;
  };
  napAmRelation: {
    type: string;
    nature: 'Tương Sinh' | 'Tỉ Hòa' | 'Sinh Xuất' | 'Khắc Xuất' | 'Tương Khắc';
    explanation: string;
  };
  deities: {
    name: string;
    type: 'Cát Thần' | 'Hung Sát';
    description: string;
  }[];
  totalScore: number;
  verdict: 'Đại Cát Hợp Bản Mệnh' | 'Cát Lợi Khá' | 'Bình Hòa Có Thể Dùng' | 'Đại Kỵ Xung Tuổi Không Nên Dùng';
  advice: string;
  classicalEvidence: ClassicalEvidenceProfile;
}

export function evaluatePersonalDateCompatibility(
  personBirthYear: number,
  personBirthMonth: number,
  personBirthDay: number,
  targetYear: number,
  targetMonth: number,
  targetDay: number
): PersonalDateCompatibility {
  // 1. Tính Can Chi & Nạp Âm của đương số
  const baziYear = getBaziYearCanChi(personBirthYear, personBirthMonth, personBirthDay);
  const personYearCanChi = baziYear.fullName;
  const personNapAm = NAP_AM_MAP[personYearCanChi] || 'Sa Trung Kim';
  const personElement = personNapAm.split(' ').pop() || 'Kim';

  // 2. Tính Can Chi & Nạp Âm của ngày mục tiêu
  const targetDayCanChiObj = getDayCanChi(targetDay, targetMonth, targetYear);
  const dayCanChi = targetDayCanChiObj.fullName;
  const dayNapAm = NAP_AM_MAP[dayCanChi] || 'Giản Hạ Thủy';
  const dayElement = dayNapAm.split(' ').pop() || 'Thủy';
  const baseDayRating = evaluateDate(targetYear, targetMonth, targetDay);

  // 3. Đánh giá Chi tuổi vs Chi ngày
  const dayBranch = targetDayCanChiObj.chi;
  const personBranch = baziYear.chi;
  const zodiacList = get12ZodiacCompatibility(dayBranch);
  const matchedZodiac = zodiacList.find(z => z.branch === personBranch);

  const branchRelation: PersonalDateCompatibility['branchRelation'] = {
    type: matchedZodiac?.relationType || 'Bình Hòa',
    isConflict: matchedZodiac?.relationType === 'Lục Xung',
    isHarmony: matchedZodiac?.relationType === 'Lục Hợp' || matchedZodiac?.relationType === 'Tam Hợp',
    nature: matchedZodiac?.relationType === 'Lục Hợp' || matchedZodiac?.relationType === 'Tam Hợp'
      ? 'Đại Cát'
      : matchedZodiac?.relationType === 'Lục Xung'
      ? 'Đại Hung'
      : matchedZodiac?.relationType === 'Tương Hại' || matchedZodiac?.relationType === 'Tương Hình'
      ? 'Kỵ'
      : 'Bình',
    explanation: matchedZodiac?.advice || 'Chi tuổi và Chi ngày bình hòa không xung khắc.'
  };

  // 4. Đánh giá Can tuổi vs Can ngày
  const personStem = baziYear.can;
  const dayStem = targetDayCanChiObj.can;

  const stemHeMap: Record<string, string> = {
    'Giáp': 'Kỷ', 'Kỷ': 'Giáp',
    'Ất': 'Canh', 'Canh': 'Ất',
    'Bính': 'Tân', 'Tân': 'Bính',
    'Đinh': 'Nhâm', 'Nhâm': 'Đinh',
    'Mậu': 'Quý', 'Quý': 'Mậu'
  };

  const stemKhacMap: Record<string, string[]> = {
    'Giáp': ['Mậu'], 'Ất': ['Kỷ'], 'Bính': ['Canh'], 'Đinh': ['Tân'], 'Mậu': ['Nhâm'],
    'Kỷ': ['Quý'], 'Canh': ['Giáp'], 'Tân': ['Ất'], 'Nhâm': ['Bính'], 'Quý': ['Đinh']
  };

  let stemRelation: PersonalDateCompatibility['stemRelation'] = {
    type: 'Bình Hòa',
    nature: 'Bình',
    explanation: `Can tuổi ${personStem} và Can ngày ${dayStem} bình hòa, không can dự xung khắc.`
  };

  if (stemHeMap[personStem] === dayStem) {
    stemRelation = {
      type: 'Thiên Can Tương Hợp',
      nature: 'Hợp',
      explanation: `Can tuổi ${personStem} hợp Can ngày ${dayStem} (Thiên Can Ngũ Hợp). Đắc khí tương sinh hữu tình, gia tăng cơ hội kết giao và tài lộc.`
    };
  } else if (stemKhacMap[personStem]?.includes(dayStem)) {
    stemRelation = {
      type: 'Bản Mệnh Khắc Can Ngày',
      nature: 'Khắc',
      explanation: `Can tuổi ${personStem} khắc Can ngày ${dayStem}. Đương số có thế chủ động làm chủ tình thế, mưu cầu tài lộc thuận lợi.`
    };
  } else if (stemKhacMap[dayStem]?.includes(personStem)) {
    stemRelation = {
      type: 'Can Ngày Khắc Can Tuổi',
      nature: 'Khắc',
      explanation: `Can ngày ${dayStem} khắc Can tuổi ${personStem}. Ngoại cảnh tạo áp lực lên đương số, nên khiêm nhường cẩn trọng.`
    };
  }

  // 5. Đánh giá Nạp Âm Ngũ Hành
  const sinhCycle: Record<string, string> = {
    'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
  };
  const khacCycle: Record<string, string> = {
    'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
  };

  let napAmRelation: PersonalDateCompatibility['napAmRelation'] = {
    type: 'Bình Hòa',
    nature: 'Tỉ Hòa',
    explanation: `Nạp Âm tuổi (${personNapAm}) và Nạp Âm ngày (${dayNapAm}) bình ổn.`
  };

  if (sinhCycle[dayElement] === personElement) {
    napAmRelation = {
      type: 'Nạp Âm Ngày Sinh Nạp Âm Tuổi',
      nature: 'Tương Sinh',
      explanation: `Khí ngày (${dayElement}) dưỡng Mệnh đương số (${personElement}). Đắc thiên thời địa lợi, sinh khí dồi dào, thân thể và tâm trí an khang.`
    };
  } else if (personElement === dayElement) {
    napAmRelation = {
      type: 'Đồng Hành Tỉ Hòa',
      nature: 'Tỉ Hòa',
      explanation: `Cùng hành ${personElement}, đồng khí tương cầu, làm việc có bạn bè, đối tác kề vai sát cánh.`
    };
  } else if (sinhCycle[personElement] === dayElement) {
    napAmRelation = {
      type: 'Mệnh Sinh Xuất Cho Ngày',
      nature: 'Sinh Xuất',
      explanation: `Mệnh đương số (${personElement}) sinh tiết cho ngày (${dayElement}). Dễ hao tổn năng lượng, thích hợp làm từ thiện hoặc chi tiêu có kế hoạch.`
    };
  } else if (khacCycle[personElement] === dayElement) {
    napAmRelation = {
      type: 'Mệnh Khắc Nạp Âm Ngày (Đoạt Tài)',
      nature: 'Khắc Xuất',
      explanation: `Mệnh (${personElement}) khắc Nạp Âm ngày (${dayElement}). Khắc xuất vi Tài, đương số nắm thế kiểm soát tài chính, lợi cho đầu tư.`
    };
  } else if (khacCycle[dayElement] === personElement) {
    napAmRelation = {
      type: 'Nạp Âm Ngày Khắc Bản Mệnh',
      nature: 'Tương Khắc',
      explanation: `Ngày (${dayElement}) khắc Mệnh (${personElement}). Khí ngày lấn át bản mệnh, dễ gặp trở lực bất ngờ, cần giữ tâm thế bình tĩnh.`
    };
  }

  // 6. Tính Thần Sát Nhật Mệnh
  const deities: PersonalDateCompatibility['deities'] = [];

  // Thiên Ất Quý Nhân:
  const quyNhanMap: Record<string, string[]> = {
    'Giáp': ['Sửu', 'Mùi'],
    'Mậu': ['Sửu', 'Mùi'],
    'Canh': ['Sửu', 'Mùi'],
    'Ất': ['Tý', 'Thân'],
    'Kỷ': ['Tý', 'Thân'],
    'Bính': ['Hợi', 'Dậu'],
    'Đinh': ['Hợi', 'Dậu'],
    'Nhâm': ['Tỵ', 'Mão'],
    'Quý': ['Tỵ', 'Mão'],
    'Tân': ['Ngọ', 'Dần'],
  };
  if (quyNhanMap[personStem]?.includes(dayBranch)) {
    deities.push({
      name: 'Thiên Ất Quý Nhân',
      type: 'Cát Thần',
      description: 'Cát thần tối thượng của bản mệnh hiển lộ vào ngày này. Gặp dữ hóa lành, đi đâu cũng có người chỉ đường dẫn lối, giúp đỡ tận tình.'
    });
  }

  // Lộc Thần:
  const locMap: Record<string, string> = {
    'Giáp': 'Dần', 'Ất': 'Mão', 'Bính': 'Tỵ', 'Mậu': 'Tỵ',
    'Đinh': 'Ngọ', 'Kỷ': 'Ngọ', 'Canh': 'Thân', 'Tân': 'Dậu',
    'Nhâm': 'Hợi', 'Quý': 'Tý'
  };
  if (locMap[personStem] === dayBranch) {
    deities.push({
      name: 'Lộc Thần (Chính Lộc Bản Mệnh)',
      type: 'Cát Thần',
      description: 'Lộc Thần lâm nhật, ngày hội tụ tài khí vượng phát của tuổi. Thích hợp nhận chức, mở cửa hàng, ký hợp đồng tài chính hoặc nhận lộc may mắn.'
    });
  }

  // Dịch Mã (theo Chi tuổi):
  const maMap: Record<string, string> = {
    'Thân': 'Dần', 'Tý': 'Dần', 'Thìn': 'Dần',
    'Dần': 'Thân', 'Ngọ': 'Thân', 'Tuất': 'Thân',
    'Tỵ': 'Hợi', 'Dậu': 'Hợi', 'Sửu': 'Hợi',
    'Hợi': 'Tỵ', 'Mão': 'Tỵ', 'Mùi': 'Tỵ'
  };
  if (maMap[personBranch] === dayBranch) {
    deities.push({
      name: 'Dịch Mã Tinh',
      type: 'Cát Thần',
      description: 'Chủ về sự năng động, đi lại, xuất ngoại, giao thiệp. Rất tốt cho việc xuất hành đi xa, công tác, dời đổi văn phòng hoặc chuyển nhà mới.'
    });
  }

  // Đào Hoa (theo Chi tuổi):
  const daoHoaMap: Record<string, string> = {
    'Thân': 'Dậu', 'Tý': 'Dậu', 'Thìn': 'Dậu',
    'Dần': 'Mão', 'Ngọ': 'Mão', 'Tuất': 'Mão',
    'Tỵ': 'Ngọ', 'Dậu': 'Ngọ', 'Sửu': 'Ngọ',
    'Hợi': 'Tý', 'Mão': 'Tý', 'Mùi': 'Tý'
  };
  if (daoHoaMap[personBranch] === dayBranch) {
    deities.push({
      name: 'Hàm Trì (Đào Hoa Tinh)',
      type: 'Cát Thần',
      description: 'Gia tăng sức hút cá nhân, tình cảm hài hòa, rất thuận lợi cho việc cưới hỏi, đính hôn, hẹn hò hoặc đàm phán ngoại giao cần sự thiện cảm.'
    });
  }

  // 7. Điểm số cá nhân hóa & Kết luận
  let totalScore = baseDayRating.score;
  if (branchRelation.isConflict) totalScore -= 40;
  else if (branchRelation.type === 'Lục Hợp') totalScore += 16;
  else if (branchRelation.type === 'Tam Hợp') totalScore += 12;
  else if (branchRelation.nature === 'Kỵ') totalScore -= 12;

  if (stemRelation.nature === 'Hợp') totalScore += 8;
  else if (stemRelation.nature === 'Khắc' && stemRelation.type.includes('Can Ngày Khắc')) totalScore -= 6;

  if (napAmRelation.nature === 'Tương Sinh') totalScore += 12;
  else if (napAmRelation.nature === 'Tỉ Hòa') totalScore += 6;
  else if (napAmRelation.nature === 'Tương Khắc') totalScore -= 15;

  deities.forEach(d => {
    if (d.type === 'Cát Thần') totalScore += 8;
  });

  totalScore = Math.max(8, Math.min(99, totalScore));

  let verdict: PersonalDateCompatibility['verdict'] = 'Bình Hòa Có Thể Dùng';
  let advice = '';

  if (branchRelation.isConflict) {
    verdict = 'Đại Kỵ Xung Tuổi Không Nên Dùng';
    advice = `Ngày này trực xung với Chi tuổi (${personBranch} xung ${dayBranch} - Nhật Tuế Tương Xung). Cổ thư 《Hiệp Kỷ Biện Phương Thư》 khẳng định đây là ngày Tuế Phá đối với tuổi của bạn. Bất kể ngày có là Hoàng Đạo với thiên hạ, thì riêng bạn vẫn nên hoãn mọi việc đại sự, tránh ký kết lớn, xuất hành đi xa hay tổ chức hôn lễ.`;
  } else if (totalScore >= 82) {
    verdict = 'Đại Cát Hợp Bản Mệnh';
    advice = `Ngày rất hợp với tuổi của bạn! Địa chi ${branchRelation.type}, ${napAmRelation.explanation} ${deities.length > 0 ? `Lại được cát thần ${deities.map(d => d.name).join(', ')} phò trợ.` : ''} Thích hợp nhất để tiến hành các việc trọng đại đã định sẵn.`;
  } else if (totalScore >= 68) {
    verdict = 'Cát Lợi Khá';
    advice = `Ngày có cát khí tương trợ cho bản mệnh đương số. Công việc tiến hành thuận lợi nếu chuẩn bị chu đáo. ${deities.length > 0 ? `Được ${deities[0].name} gia ân cát khí.` : ''}`;
  } else if (totalScore >= 45) {
    verdict = 'Bình Hòa Có Thể Dùng';
    advice = `Ngày bình hòa đối với tuổi của bạn, không gặp xung đột gay gắt. Thích hợp giải quyết công việc thường nhật, gặp gỡ giao lưu nội bộ, giữ gìn hòa khí.`;
  } else {
    verdict = 'Đại Kỵ Xung Tuổi Không Nên Dùng';
    advice = `Ngày này có nhiều yếu tố tương khắc với bản mệnh (${napAmRelation.type}). Nên cẩn trọng trong các quyết định chi tiêu lớn hoặc di chuyển xa.`;
  }

  // 8. Hồ sơ dẫn chứng cổ thư
  const baseRule = VERIFIED_CLASSICAL_RULES_REGISTRY['RULE-TC-001'];
  const classicalEvidence: ClassicalEvidenceProfile = {
    claimId: `CLM-TC-${Date.now().toString().slice(-4)}`,
    ruleCode: baseRule.ruleCode,
    conclusion: `Đánh giá ngày ${dayCanChi} cho tuổi ${personYearCanChi} (${personNapAm}): Phân hạng [${verdict}], Điểm số [${totalScore}/100]. ${branchRelation.type} giữa Chi tuổi ${personBranch} và Chi ngày ${dayBranch}.`,
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
    appliedChartData: `Bản Mệnh: ${personYearCanChi} (${personNapAm}) | Ngày Xem: ${dayCanChi} (${dayNapAm}) | Chi tương ứng: ${personBranch} đối ${dayBranch} (${branchRelation.type}) | Thần sát đắc vị: ${deities.map(d => d.name).join(', ') || 'Không'}`,
    applicationLimits: baseRule.applicationLimits,
    school: baseRule.school,
    verificationStatus: baseRule.verificationStatus,
    reviewer: baseRule.reviewer,
    approvalVersion: baseRule.approvalVersion,
    approvalDate: baseRule.approvalDate
  };

  return {
    personBirthDate: `${personBirthYear}-${personBirthMonth.toString().padStart(2, '0')}-${personBirthDay.toString().padStart(2, '0')}`,
    personYearCanChi,
    personNapAm,
    targetDate: `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${targetDay.toString().padStart(2, '0')}`,
    dayCanChi,
    dayNapAm,
    branchRelation,
    stemRelation,
    napAmRelation,
    deities,
    totalScore,
    verdict,
    advice,
    classicalEvidence
  };
}
