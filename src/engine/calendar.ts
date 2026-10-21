/**
 * ĐẠO MỆNH – CORE CALENDAR & SOLAR TERM ENGINE
 * Thuật toán Thiên văn Lịch pháp Âm Dương & 24 Tiết Khí
 * Chuẩn múi giờ Việt Nam (GMT+7, Kinh độ 105°-108°E)
 */

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  leapMonth?: number;
}

export interface CanChi {
  can: string;
  chi: string;
  element: string; // Ngũ hành
  yinYang: 'Dương' | 'Âm';
  fullName: string;
}

export interface SolarTermInfo {
  name: string;
  solarLongitude: number;
  approxDate: string;
}

export const HEAVENLY_STEMS: { name: string; element: string; yinYang: 'Dương' | 'Âm' }[] = [
  { name: 'Giáp', element: 'Mộc', yinYang: 'Dương' },
  { name: 'Ất', element: 'Mộc', yinYang: 'Âm' },
  { name: 'Bính', element: 'Hỏa', yinYang: 'Dương' },
  { name: 'Đinh', element: 'Hỏa', yinYang: 'Âm' },
  { name: 'Mậu', element: 'Thổ', yinYang: 'Dương' },
  { name: 'Kỷ', element: 'Thổ', yinYang: 'Âm' },
  { name: 'Canh', element: 'Kim', yinYang: 'Dương' },
  { name: 'Tân', element: 'Kim', yinYang: 'Âm' },
  { name: 'Nhâm', element: 'Thủy', yinYang: 'Dương' },
  { name: 'Quý', element: 'Thủy', yinYang: 'Âm' },
];

export const EARTHLY_BRANCHES: { name: string; element: string; yinYang: 'Dương' | 'Âm'; animal: string }[] = [
  { name: 'Tý', element: 'Thủy', yinYang: 'Dương', animal: 'Chuột' },
  { name: 'Sửu', element: 'Thổ', yinYang: 'Âm', animal: 'Trâu' },
  { name: 'Dần', element: 'Mộc', yinYang: 'Dương', animal: 'Hổ' },
  { name: 'Mão', element: 'Mộc', yinYang: 'Âm', animal: 'Mèo' },
  { name: 'Thìn', element: 'Thổ', yinYang: 'Dương', animal: 'Rồng' },
  { name: 'Tỵ', element: 'Hỏa', yinYang: 'Âm', animal: 'Rắn' },
  { name: 'Ngọ', element: 'Hỏa', yinYang: 'Dương', animal: 'Ngựa' },
  { name: 'Mùi', element: 'Thổ', yinYang: 'Âm', animal: 'Dê' },
  { name: 'Thân', element: 'Kim', yinYang: 'Dương', animal: 'Khỉ' },
  { name: 'Dậu', element: 'Kim', yinYang: 'Âm', animal: 'Gà' },
  { name: 'Tuất', element: 'Thổ', yinYang: 'Dương', animal: 'Chó' },
  { name: 'Hợi', element: 'Thủy', yinYang: 'Âm', animal: 'Lợn' },
];

export const SOLAR_TERMS: SolarTermInfo[] = [
  { name: 'Tiểu Hàn', solarLongitude: 285, approxDate: '05/01 - 06/01' },
  { name: 'Đại Hàn', solarLongitude: 300, approxDate: '20/01 - 21/01' },
  { name: 'Lập Xuân', solarLongitude: 315, approxDate: '04/02 - 05/02' },
  { name: 'Vũ Thủy', solarLongitude: 330, approxDate: '18/02 - 19/02' },
  { name: 'Kinh Trập', solarLongitude: 345, approxDate: '05/03 - 06/03' },
  { name: 'Xuân Phân', solarLongitude: 0, approxDate: '20/03 - 21/03' },
  { name: 'Thanh Minh', solarLongitude: 15, approxDate: '04/04 - 05/04' },
  { name: 'Cốc Vũ', solarLongitude: 30, approxDate: '20/04 - 21/04' },
  { name: 'Lập Hạ', solarLongitude: 45, approxDate: '05/05 - 06/05' },
  { name: 'Tiểu Mãn', solarLongitude: 60, approxDate: '21/05 - 22/05' },
  { name: 'Mang Chủng', solarLongitude: 75, approxDate: '05/06 - 06/06' },
  { name: 'Hạ Chí', solarLongitude: 90, approxDate: '21/06 - 22/06' },
  { name: 'Tiểu Thử', solarLongitude: 105, approxDate: '07/07 - 08/07' },
  { name: 'Đại Thử', solarLongitude: 120, approxDate: '22/07 - 23/07' },
  { name: 'Lập Thu', solarLongitude: 135, approxDate: '07/08 - 08/08' },
  { name: 'Xử Thử', solarLongitude: 150, approxDate: '23/08 - 24/08' },
  { name: 'Bạch Lộ', solarLongitude: 165, approxDate: '07/09 - 08/09' },
  { name: 'Thu Phân', solarLongitude: 180, approxDate: '23/09 - 24/09' },
  { name: 'Hàn Lộ', solarLongitude: 195, approxDate: '08/10 - 09/10' },
  { name: 'Sương Giáng', solarLongitude: 210, approxDate: '23/10 - 24/10' },
  { name: 'Lập Đông', solarLongitude: 225, approxDate: '07/11 - 08/11' },
  { name: 'Tiểu Tuyết', solarLongitude: 240, approxDate: '22/11 - 23/11' },
  { name: 'Đại Tuyết', solarLongitude: 255, approxDate: '07/12 - 08/12' },
  { name: 'Đông Chí', solarLongitude: 270, approxDate: '21/12 - 22/12' },
];

// Nạp Âm 60 Hoa Giáp
export const NAP_AM_MAP: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy',
};

/**
 * Tính Julian Day Number từ Dương lịch
 */
export function jdFromDate(d: number, m: number, y: number): number {
  let a = Math.floor((14 - m) / 12);
  let y1 = y + 4800 - a;
  let m1 = m + 12 * a - 3;
  let jd = d + Math.floor((153 * m1 + 2) / 5) + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) - 32045;
  return jd;
}

/**
 * Tính Can Chi của Ngày từ Julian Day
 * Chu kỳ 60 ngày
 */
export function getDayCanChi(d: number, m: number, y: number): CanChi {
  const jd = jdFromDate(d, m, y);
  // jd=2451545 (2000-01-01) là ngày Mậu Ngọ (Can Mậu = 4, Chi Ngọ = 6)
  // 2451545 % 10 = 5 -> Mậu (4) => (jd + 9) % 10
  // 2451545 % 12 = 5 -> Ngọ (6) => (jd + 1) % 12
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  const can = HEAVENLY_STEMS[canIndex];
  const chi = EARTHLY_BRANCHES[chiIndex];
  return {
    can: can.name,
    chi: chi.name,
    element: can.element,
    yinYang: can.yinYang,
    fullName: `${can.name} ${chi.name}`
  };
}

/**
 * Tính Kinh độ Hoàng đạo Mặt Trời (Solar Longitude) tại thời điểm bất kỳ
 * Trả về góc 0 - 360 độ (0° = Xuân Phân, 90° = Hạ Chí, 180° = Thu Phân, 270° = Đông Chí, 315° = Lập Xuân)
 */
export function getSolarLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180.0;
  let C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
        + 0.000289 * Math.sin(3 * Mrad);
  let trueLong = L0 + C;
  trueLong = trueLong % 360.0;
  if (trueLong < 0) trueLong += 360.0;
  return trueLong;
}

/**
 * Xác định Tiết Khí hiện tại theo Kinh độ Mặt trời
 */
export function getCurrentSolarTerm(year: number, month: number, day: number, hour: number = 12): SolarTermInfo {
  const jd = jdFromDate(day, month, year) + (hour - 7) / 24.0;
  const L = getSolarLongitude(jd);
  
  // Mỗi tiết khí cách nhau 15 độ kinh độ mặt trời
  // Lập Xuân bắt đầu tại 315 độ
  // 315: Lập Xuân, 330: Vũ Thủy, 345: Kinh Trập, 0: Xuân Phân, 15: Thanh Minh, ...
  const termDegrees = [
    285, 300, 315, 330, 345, 0, 15, 30, 45, 60, 75, 90, 
    105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270
  ];
  
  let currentIndex = 0;
  for (let i = 0; i < termDegrees.length; i++) {
    const start = termDegrees[i];
    const end = (start + 15) % 360;
    if (start < end) {
      if (L >= start && L < end) {
        currentIndex = i;
        break;
      }
    } else {
      // Băng qua 0 độ (ví dụ 345 đến 0)
      if (L >= start || L < end) {
        currentIndex = i;
        break;
      }
    }
  }
  return SOLAR_TERMS[currentIndex];
}

/**
 * Tính Can Chi Năm (dành cho Bát Tự - mốc đổi năm là thời điểm LẬP XUÂN ~ 315°)
 */
export function getBaziYearCanChi(year: number, month: number, day: number, hour: number = 12): CanChi {
  const jd = jdFromDate(day, month, year) + (hour - 7) / 24.0;
  const L = getSolarLongitude(jd);
  
  // Nếu chưa tới Lập Xuân (tháng 1 hoặc đầu tháng 2 trước Lập Xuân, L nằm giữa 285° và 315°)
  // thì năm Bát Tự vẫn tính là năm trước!
  let baziYear = year;
  if (month <= 2 && (L >= 270 && L < 315)) {
    baziYear = year - 1;
  }

  // 1984 là năm Giáp Tý (Can Giáp = 0, Chi Tý = 0)
  const canIndex = (baziYear - 4) % 10;
  const chiIndex = (baziYear - 4) % 12;
  const can = HEAVENLY_STEMS[(canIndex + 10) % 10];
  const chi = EARTHLY_BRANCHES[(chiIndex + 12) % 12];

  return {
    can: can.name,
    chi: chi.name,
    element: can.element,
    yinYang: can.yinYang,
    fullName: `${can.name} ${chi.name}`
  };
}

/**
 * Tính Can Chi Tháng Bát Tự (theo 12 Tiết lệnh: Lập Xuân = Dần, Kinh Trập = Mão...)
 * Sử dụng Thuyết "Ngũ Hổ Độn Nguyệt" dựa trên Can Năm Bát Tự
 */
export function getBaziMonthCanChi(yearCan: string, year: number, month: number, day: number, hour: number = 12): CanChi {
  const jd = jdFromDate(day, month, year) + (hour - 7) / 24.0;
  const L = getSolarLongitude(jd);

  // 12 Chi tháng theo Tiết khí Bát Tự:
  // Lập Xuân (315°) -> Dần (Tháng 1 Bát Tự)
  // Kinh Trập (345°) -> Mão (Tháng 2)
  // Thanh Minh (15°) -> Thìn (Tháng 3)
  // Lập Hạ (45°) -> Tỵ (Tháng 4)
  // Mang Chủng (75°) -> Ngọ (Tháng 5)
  // Tiểu Thử (105°) -> Mùi (Tháng 6)
  // Lập Thu (135°) -> Thân (Tháng 7)
  // Bạch Lộ (165°) -> Dậu (Tháng 8)
  // Hàn Lộ (195°) -> Tuất (Tháng 9)
  // Lập Đông (225°) -> Hợi (Tháng 10)
  // Đại Tuyết (255°) -> Tý (Tháng 11)
  // Tiểu Hàn (285°) -> Sửu (Tháng 12)
  
  let branchName = 'Dần';
  let monthOrder = 0; // 0 = Dần, 1 = Mão, ..., 11 = Sửu

  if (L >= 315 && L < 345) { branchName = 'Dần'; monthOrder = 0; }
  else if (L >= 345 || L < 15) { branchName = 'Mão'; monthOrder = 1; }
  else if (L >= 15 && L < 45) { branchName = 'Thìn'; monthOrder = 2; }
  else if (L >= 45 && L < 75) { branchName = 'Tỵ'; monthOrder = 3; }
  else if (L >= 75 && L < 105) { branchName = 'Ngọ'; monthOrder = 4; }
  else if (L >= 105 && L < 135) { branchName = 'Mùi'; monthOrder = 5; }
  else if (L >= 135 && L < 165) { branchName = 'Thân'; monthOrder = 6; }
  else if (L >= 165 && L < 195) { branchName = 'Dậu'; monthOrder = 7; }
  else if (L >= 195 && L < 225) { branchName = 'Tuất'; monthOrder = 8; }
  else if (L >= 225 && L < 255) { branchName = 'Hợi'; monthOrder = 9; }
  else if (L >= 255 && L < 285) { branchName = 'Tý'; monthOrder = 10; }
  else { branchName = 'Sửu'; monthOrder = 11; }

  // Khẩu quyết "Ngũ Hổ Độn Nguyệt":
  // Giáp Kỷ chi niên Bính Dần thủ (Canh tháng 1 là Bính)
  // Ất Canh chi tuế Mậu Dần đầu (Canh tháng 1 là Mậu)
  // Bính Tân chi niên tầm Canh Dần (Canh tháng 1 là Canh)
  // Đinh Nhâm Nhâm Dần thuận hành lưu (Canh tháng 1 là Nhâm)
  // Mậu Quý chi niên khởi Giáp Dần (Canh tháng 1 là Giáp)
  const tigerStartStemMap: Record<string, number> = {
    'Giáp': 2, // Bính
    'Kỷ': 2,
    'Ất': 4, // Mậu
    'Canh': 4,
    'Bính': 6, // Canh
    'Tân': 6,
    'Đinh': 8, // Nhâm
    'Nhâm': 8,
    'Mậu': 0, // Giáp
    'Quý': 0,
  };

  const startStem = tigerStartStemMap[yearCan] ?? 0;
  const monthStemIndex = (startStem + monthOrder) % 10;
  const stem = HEAVENLY_STEMS[monthStemIndex];
  const branch = EARTHLY_BRANCHES.find(b => b.name === branchName)!;

  return {
    can: stem.name,
    chi: branch.name,
    element: stem.element,
    yinYang: stem.yinYang,
    fullName: `${stem.name} ${branch.name}`
  };
}

/**
 * Tính Can Chi Giờ (Thuyết Ngũ Thử Độn Nhật)
 * @param dayCan Can của Trụ Ngày
 * @param hour Giờ sinh (0 - 23)
 * @param minute Phút sinh (0 - 59)
 * @param dayBoundary 'zi_split' (23h-24h là Dạ Tý thuộc ngày cũ) hoặc 'midnight' (23h sang ngày mới)
 */
export function getHourCanChi(dayCan: string, hour: number, minute: number = 0, dayBoundary: 'zi_split' | 'midnight' = 'zi_split'): CanChi {
  // Xác định Chi giờ:
  // 23:00 - 00:59: Tý
  // 01:00 - 02:59: Sửu
  // 03:00 - 04:59: Dần
  // 05:00 - 06:59: Mão
  // 07:00 - 08:59: Thìn
  // 09:00 - 10:59: Tỵ
  // 11:00 - 12:59: Ngọ
  // 13:00 - 14:59: Mùi
  // 15:00 - 16:59: Thân
  // 17:00 - 18:59: Dậu
  // 19:00 - 20:59: Tuất
  // 21:00 - 22:59: Hợi
  let branchOrder = Math.floor((hour + 1) / 2) % 12;

  // Khẩu quyết "Ngũ Thử Độn Nhật":
  // Giáp Kỷ hoàn gia Giáp (Giáp Tý)
  // Ất Canh Bính tác sơ (Bính Tý)
  // Bính Tân tòng Mậu khởi (Mậu Tý)
  // Đinh Nhâm Canh Tý cư (Canh Tý)
  // Mậu Quý hà phương phát, Nhâm Tý thị chân đồ (Nhâm Tý)
  const ratStartStemMap: Record<string, number> = {
    'Giáp': 0, // Giáp
    'Kỷ': 0,
    'Ất': 2, // Bính
    'Canh': 2,
    'Bính': 4, // Mậu
    'Tân': 4,
    'Đinh': 6, // Canh
    'Nhâm': 6,
    'Mậu': 8, // Nhâm
    'Quý': 8,
  };

  const startStem = ratStartStemMap[dayCan] ?? 0;
  const hourStemIndex = (startStem + branchOrder) % 10;
  const stem = HEAVENLY_STEMS[hourStemIndex];
  const branch = EARTHLY_BRANCHES[branchOrder];

  return {
    can: stem.name,
    chi: branch.name,
    element: stem.element,
    yinYang: stem.yinYang,
    fullName: `${stem.name} ${branch.name}`
  };
}

/**
 * Thuật toán thiên văn tính ngày Sóc (New Moon) theo Jean Meeus / Hồ Ngọc Đức
 */
function getNewMoonDay(k: number, timeZone: number = 7.0): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const M = 2.5534 + 29.10535669 * k - 0.0000218 * T2 - 0.00000011 * T3;
  const Mprime = 201.5643 + 385.81693528 * k + 0.0107438 * T2 + 0.00001239 * T3 - 0.000000058 * T4;
  const F = 160.7108 + 390.67050274 * k - 0.0016341 * T2 - 0.00000227 * T3 + 0.00000011 * T4;
  const omega = 124.7746 - 1.56375580 * k + 0.0020691 * T2 + 0.00000215 * T3;
  const Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
            + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * Math.PI / 180.0);
  const pt = -0.40720 * Math.sin(Mprime * Math.PI / 180.0)
           + 0.17241 * Math.sin(M * Math.PI / 180.0)
           + 0.01608 * Math.sin(2 * Mprime * Math.PI / 180.0)
           + 0.01039 * Math.sin(2 * F * Math.PI / 180.0)
           + 0.00739 * Math.sin((Mprime - M) * Math.PI / 180.0)
           - 0.00514 * Math.sin((Mprime + M) * Math.PI / 180.0)
           + 0.00208 * Math.sin(2 * M * Math.PI / 180.0)
           - 0.00111 * Math.sin((Mprime - 2 * F) * Math.PI / 180.0)
           - 0.00057 * Math.sin((Mprime + 2 * F) * Math.PI / 180.0)
           + 0.00056 * Math.sin((2 * Mprime + M) * Math.PI / 180.0)
           - 0.00042 * Math.sin((2 * F + M) * Math.PI / 180.0)
           + 0.00042 * Math.sin((Mprime - 2 * M) * Math.PI / 180.0)
           + 0.00038 * Math.sin((2 * Mprime - M) * Math.PI / 180.0)
           - 0.00024 * Math.sin((2 * F - M) * Math.PI / 180.0)
           - 0.00017 * Math.sin(omega * Math.PI / 180.0);
  return Math.floor(Jd1 + pt + 0.5 + timeZone / 24.0);
}

function getSunLongitudeHND(jdn: number, timeZone: number = 7.0): number {
  const T = (jdn - 0.5 - timeZone / 24.0 - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = (M * Math.PI) / 180.0;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  let trueLong = (L0 + C) % 360.0;
  if (trueLong < 0) trueLong += 360.0;
  return Math.floor(trueLong / 30.0);
}

function getLunarMonth11(yy: number, timeZone: number = 7.0): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitudeHND(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number = 7.0): number {
  const k = Math.floor((a11 - 2415021.0769986) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitudeHND(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitudeHND(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển đổi Dương Lịch sang Âm Lịch Việt Nam
 * Thuật toán thiên văn Hồ Ngọc Đức (chuẩn xác mốc ngày sóc & trung khí múi giờ GMT+7)
 */
export function convertSolarToLunar(dd: number, mm: number, yy: number, timeZone: number = 7.0): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.0769986) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(yy - 1, timeZone);
  let b11 = getLunarMonth11(yy, timeZone);
  let lunarYear = yy;

  if (monthStart < a11) {
    lunarYear = yy - 1;
    b11 = a11;
    a11 = getLunarMonth11(yy - 2, timeZone);
  } else if (monthStart >= b11) {
    lunarYear = yy + 1;
    a11 = b11;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarMonth = diff + 11;
  let isLeap = false;

  let leapOffset = 0;
  const numMonths = Math.floor((b11 - a11) / 29);
  if (numMonths > 12) {
    leapOffset = getLeapMonthOffset(a11, timeZone);
  }

  if (leapOffset > 0 && diff >= leapOffset) {
    lunarMonth = diff + 10;
    if (diff === leapOffset) {
      isLeap = true;
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear = lunarYear - 1;
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap
  };
}
