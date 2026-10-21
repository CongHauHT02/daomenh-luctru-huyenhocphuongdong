/**
 * ĐẠO MỆNH – BỘ KIỂM THỬ THUẬT TOÁN TỰ ĐỘNG (VERIFICATION TEST RUNNER)
 * Kiểm tra các trường hợp biên lịch pháp:
 * 1. Chuyển giao Tiết Khí Lập Xuân vs Tết Âm Lịch
 * 2. Phân định Trụ Tháng Bát Tự theo Tiết Khí
 * 3. Ngũ Thử Độn Nhật và ranh giới Giờ Tý
 * 4. Công thức Thai Nguyên & Mệnh Cung Lục Trụ
 * 5. An sao Tử Vi Đẩu Số 12 Cung
 */

import { getDayCanChi, getBaziYearCanChi, getBaziMonthCanChi, getHourCanChi, getCurrentSolarTerm } from './calendar';
import { generateBaziChart } from './bazi';
import { calculateThaiNguyen, calculateMenhCung } from './liuzhu';
import { getMenhThanPositions, calculateCuc, getTuViPosition, generateTuViChart } from './tuvi';
import { analyzeCompatibility } from './compatibility';
import { get12ZodiacCompatibility, evaluatePersonalDateCompatibility } from './dateSelection';

import { 
  classifyHandFiveElements, 
  buildComprehensivePalmReport, 
  PALM_LINES_CATALOG, 
  PALM_MOUNTS_CATALOG,
  PalmLineData,
  PalmMountData
} from './palmistry';

export interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  notes?: string;
}

export function runAllMetaphysicsTests(): {
  total: number;
  passedCount: number;
  failedCount: number;
  results: TestCaseResult[];
} {
  const results: TestCaseResult[] = [];

  // TEST 1: Ngày 01/01/2000 (Julian Day: 2451545)
  // Lịch pháp kiểm chứng: Ngày Mậu Ngọ
  const dayTest1 = getDayCanChi(1, 1, 2000);
  results.push({
    id: 'cal-day-001',
    name: 'Kiểm thử Can Chi Trụ Ngày (01/01/2000)',
    description: 'Xác minh thuật toán Julian Day chuyển đổi Can Chi ngày chuẩn xác với mốc thiên văn 2000-01-01 là ngày Mậu Ngọ.',
    input: { day: 1, month: 1, year: 2000 },
    expected: 'Mậu Ngọ',
    actual: dayTest1.fullName,
    passed: dayTest1.fullName === 'Mậu Ngọ'
  });

  // TEST 2: Ranh giới Lập Xuân (04/02/2024)
  // Năm 2024 Lập Xuân rơi vào ngày 04/02/2024.
  // Trước ngày 04/02 (ví dụ 15/01/2024): Năm Bát Tự vẫn là Quý Mão (2023)
  // Sau ngày 04/02 (ví dụ 10/02/2024): Năm Bát Tự là Giáp Thìn (2024)
  const preXuan = getBaziYearCanChi(2024, 1, 15);
  const postXuan = getBaziYearCanChi(2024, 2, 10);
  results.push({
    id: 'cal-year-lapxuan',
    name: 'Kiểm thử Ranh giới Năm Bát Tự qua Tiết Lập Xuân',
    description: 'Bát Tự lấy Lập Xuân làm mốc đổi năm, không lấy mùng 1 Tết. Ngày 15/01/2024 phải là Quý Mão; ngày 10/02/2024 phải là Giáp Thìn.',
    input: { pre: '15/01/2024', post: '10/02/2024' },
    expected: { pre: 'Quý Mão', post: 'Giáp Thìn' },
    actual: { pre: preXuan.fullName, post: postXuan.fullName },
    passed: preXuan.fullName === 'Quý Mão' && postXuan.fullName === 'Giáp Thìn'
  });

  // TEST 3: Ngũ Thử Độn Nhật (Trụ Giờ)
  // Ngày Giáp hoặc Kỷ: Giờ Tý khởi Giáp Tý (0h - 1h)
  const hourTest1 = getHourCanChi('Giáp', 0, 30);
  results.push({
    id: 'bazi-hour-rat',
    name: 'Kiểm thử Thuyết Ngũ Thử Độn Nhật (Ngày Giáp khởi Giáp Tý)',
    description: 'Khẩu quyết: "Giáp Kỷ hoàn gia Giáp". Ngày Can Giáp giờ Tý phải là Giáp Tý.',
    input: { dayCan: 'Giáp', hour: 0, minute: 30 },
    expected: 'Giáp Tý',
    actual: hourTest1.fullName,
    passed: hourTest1.fullName === 'Giáp Tý'
  });

  // TEST 4: Trụ Thai Nguyên (Lục Trụ)
  // Công thức: Can Tháng + 1; Chi Tháng + 3
  // Tháng Giáp Dần -> Thai Nguyên phải là Ất Tỵ
  const thaiTest = calculateThaiNguyen('Giáp', 'Dần');
  results.push({
    id: 'liuzhu-thai-nguyen',
    name: 'Kiểm thử Thuật toán Thai Nguyên Lục Trụ',
    description: 'Tháng Giáp Dần: Can Giáp + 1 = Ất, Chi Dần + 3 = Tỵ -> Thai Nguyên là Ất Tỵ.',
    input: { monthCan: 'Giáp', monthChi: 'Dần' },
    expected: 'Ất Tỵ',
    actual: thaiTest.fullName,
    passed: thaiTest.fullName === 'Ất Tỵ'
  });

  // TEST 5: Tử Vi Đẩu Số - An Cung Mệnh & Thân
  // Tháng 1 Âm lịch, giờ Tý (0)
  // Từ Dần khởi tháng 1 đi thuận -> Dần. Từ đó khởi giờ Tý đi nghịch -> Cung Mệnh tại Dần!
  const tuviPos = getMenhThanPositions(1, 0);
  // Dần có index là 2 trong EARTHLY_BRANCHES
  results.push({
    id: 'tuvi-menh-than',
    name: 'Kiểm thử An Cung Mệnh Tử Vi (Tháng 1 Giờ Tý Mệnh cư Dần)',
    description: 'Sinh tháng Giêng giờ Tý theo cổ thư Trần Đoàn thì Cung Mệnh an tại Dần, Cung Thân đồng cung tại Dần.',
    input: { lunarMonth: 1, hourBranchIdx: 0 },
    expected: { menhIndex: 2, thanIndex: 2 },
    actual: { menhIndex: tuviPos.menhIndex, thanIndex: tuviPos.thanIndex },
    passed: tuviPos.menhIndex === 2 && tuviPos.thanIndex === 2
  });

  // TEST 6: Bát Tự toàn diện (Day Master & Ten Gods)
  const fullBazi = generateBaziChart('Test User', 'male', 1990, 5, 20, 10, 0);
  results.push({
    id: 'bazi-full-pipeline',
    name: 'Kiểm thử Toàn vẹn Đường ống Luận Bát Tự',
    description: 'Lá số phải tính toán đầy đủ 4 trụ, tàng can, thập thần của từng can và xác định nội lực Nhật Chủ không được NaN hoặc rỗng.',
    input: { birth: '20/05/1990 10:00' },
    expected: 'Hợp lệ và đầy đủ',
    actual: fullBazi.dayMaster.strength ? 'Hợp lệ và đầy đủ' : 'Lỗi dữ liệu',
    passed: Boolean(fullBazi.dayMaster.can && fullBazi.dayMaster.strength && fullBazi.pillars.year)
  });

  // TEST 7: Tử Vi Đẩu Số 12 Cung phân bổ đầy đủ Cát Tinh, Sát Tinh, Tứ Hóa, Các Vòng Sao
  const tvChart = generateTuViChart('Đương Số Test', 'male', 2000, 8, 3, 6, 30);
  const totalSecondaryStars = tvChart.palaces.reduce((sum, p) => sum + p.assistantStars.length + p.badStars.length + p.tuHoaStars.length, 0);
  const hasTuHoa = tvChart.palaces.some(p => p.tuHoaStars && p.tuHoaStars.length > 0);
  const hasThaiTue = tvChart.palaces.some(p => p.thaiTueStar !== undefined);
  const hasTrangSinh = tvChart.palaces.some(p => p.trangSinhStar !== undefined);
  results.push({
    id: 'tuvi-full-stars',
    name: 'Kiểm thử Phân Bổ Tinh Diệu Tử Vi Đầy Đủ (Cát, Sát, Tứ Hóa, 3 Vòng Sao)',
    description: '12 Cung Tử Vi không chỉ có 14 Chính Tinh mà phải có đầy đủ Phụ Tinh, Tứ Hóa, Vòng Thái Tuế, Vòng Tràng Sinh, Tuần/Triệt.',
    input: { birth: '03/08/2000 06:30' },
    expected: 'Có đầy đủ >= 20 phụ tinh, Tứ Hóa, Vòng Thái Tuế, Tràng Sinh',
    actual: `Tổng phụ tinh: ${totalSecondaryStars}, Tứ hóa: ${hasTuHoa}, Thái tuế: ${hasThaiTue}, Tràng sinh: ${hasTrangSinh}`,
    passed: totalSecondaryStars >= 20 && hasTuHoa && hasThaiTue && hasTrangSinh
  });

  // TEST 8: Hôn Nhân - Khảo Sát Tuổi Cưới & Kim Lâu
  // Cô dâu sinh năm 2000, năm 2026 tuổi mụ = 2026 - 2000 + 1 = 27 tuổi. 27 % 9 = 0 -> Không phạm Kim Lâu.
  const groomTest = { name: 'Chú Rể Test', gender: 'male' as const, year: 1998, canChiYear: 'Mậu Dần' };
  const brideTest = { name: 'Cô Dâu Test', gender: 'female' as const, year: 2000, canChiYear: 'Canh Thìn' };
  const marriageResult = analyzeCompatibility(groomTest, brideTest);
  const year2026Rec = marriageResult.marriageYears.find(r => r.year === 2026);
  results.push({
    id: 'marriage-kim-lau',
    name: 'Kiểm thử Tính Toán Tuổi Cưới & Kim Lâu Cổ Điển',
    description: 'Năm 2026, cô dâu sinh năm 2000 tròn 27 tuổi mụ (27 chia 9 dư 0) -> Không phạm Kim Lâu.',
    input: { brideBirthYear: 2000, targetYear: 2026 },
    expected: { age: 27, isKimLau: false },
    actual: { age: year2026Rec?.brideAgeMu, isKimLau: year2026Rec?.kimLauStatus.isKimLau },
    passed: year2026Rec?.brideAgeMu === 27 && year2026Rec?.kimLauStatus.isKimLau === false && Boolean(marriageResult.batQuaiYinYang) && Boolean(marriageResult.childrenForecast)
  });

  // TEST 9: Trạch Cát - Tương Quan 12 Con Giáp
  // Ngày có Chi là Thìn: Tý là Tam Hợp, Dậu là Lục Hợp, Tuất là Lục Xung
  const zodiacTest = get12ZodiacCompatibility('Thìn');
  const tyRel = zodiacTest.find(z => z.branch === 'Tý')?.relationType;
  const dauRel = zodiacTest.find(z => z.branch === 'Dậu')?.relationType;
  const tuatRel = zodiacTest.find(z => z.branch === 'Tuất')?.relationType;
  results.push({
    id: 'trachcat-12-zodiac',
    name: 'Kiểm thử Bảng Tương Quan 12 Con Giáp trong Ngày (Chi Thìn)',
    description: 'Ngày Thìn đối với 12 con giáp: Tý là Tam Hợp, Dậu là Lục Hợp, Tuất là Lục Xung (Tuế Phá).',
    input: { dayBranch: 'Thìn' },
    expected: { ty: 'Tam Hợp', dau: 'Lục Hợp', tuat: 'Lục Xung' },
    actual: { ty: tyRel, dau: dauRel, tuat: tuatRel },
    passed: tyRel === 'Tam Hợp' && dauRel === 'Lục Hợp' && tuatRel === 'Lục Xung'
  });

  // TEST 10: Trạch Cát Cá Nhân Hóa - Phát Hiện Ngày Trực Xung Chi Tuổi (Lục Xung)
  // Người tuổi Canh Thìn (2000), gặp ngày có Chi là Tuất (2026-10-27 Giáp Tuất) -> Thìn xung Tuất -> Phải cảnh báo Đại Kỵ
  const personalCompTest = evaluatePersonalDateCompatibility(2000, 8, 3, 2026, 10, 27);
  results.push({
    id: 'trachcat-personal-conflict',
    name: 'Kiểm thử Trạch Cát Cá Nhân Hóa (Phát hiện Tuổi Xung Ngày)',
    description: 'Người tuổi Thìn gặp ngày Tuất phải được xác định là Lục Xung, phân hạng Đại Kỵ Xung Tuổi Không Nên Dùng.',
    input: { personBirth: '2000-08-03', targetDay: '2026-10-27 (Tuất)' },
    expected: { isConflict: true, verdict: 'Đại Kỵ Xung Tuổi Không Nên Dùng' },
    actual: { isConflict: personalCompTest.branchRelation.isConflict, verdict: personalCompTest.verdict },
    passed: personalCompTest.branchRelation.isConflict === true && personalCompTest.verdict === 'Đại Kỵ Xung Tuổi Không Nên Dùng'
  });

  // TEST 11: Phân Loại Ngũ Hành Bàn Tay Theo Liễu Trang Thần Tướng
  // Bàn tay Kim: Lòng bàn tay vuông vức (tỷ lệ L/W ~ 1.0), ngón tay tương đối ngắn/vừa (~0.72)
  // Bàn tay Mộc: Lòng bàn tay thon dài (tỷ lệ L/W > 1.25), ngón dài thanh mảnh (>0.85)
  const kimHand = classifyHandFiveElements({
    palmLengthWidthRatio: 1.02,
    fingerToPalmRatio: 0.72,
    fingerTipShape: 'Vuông'
  });
  const mocHand = classifyHandFiveElements({
    palmLengthWidthRatio: 1.30,
    fingerToPalmRatio: 0.88,
    fingerTipShape: 'Thanh tú'
  });
  results.push({
    id: 'palmistry-five-elements',
    name: 'Kiểm thử Phân Loại Ngũ Hành Bàn Tay (Liễu Trang Thần Tướng)',
    description: 'Xác minh thuật toán phân loại bàn tay Kim và Mộc dựa trên tỷ lệ hình học không thiên kiến AI, đúng chuẩn tắc Liễu Trang Thần Tướng.',
    input: { kim: { ratio: 1.02, finger: 0.72 }, moc: { ratio: 1.30, finger: 0.88 } },
    expected: { kim: 'Kim', moc: 'Mộc' },
    actual: { kim: kimHand.element, moc: mocHand.element },
    passed: kimHand.element === 'Kim' && mocHand.element === 'Mộc' && kimHand.criteriaSatisfied.length > 0
  });

  // TEST 12: Báo Cáo Thủ Tướng Học 7 Phần & Nguyên Tắc Không AI Suy Diễn (Zero-AI)
  // Tạo dữ liệu dòng kẻ ban đầu chưa xác nhận -> Luận giải phải bị khóa (không suy đoán số mệnh)
  // Sau đó xác nhận Đường Sinh Đạo -> Luận giải xuất hiện và trích dẫn mã RULE-PM-001 (Ma Y Thần Tướng)
  const initialLines: Record<string, PalmLineData> = {};
  PALM_LINES_CATALOG.forEach(line => {
    initialLines[line.id] = {
      id: line.id,
      displayName: line.vietnameseName,
      classicalName: line.classicalName,
      color: line.color,
      candidateDetected: true,
      userVerified: false,
      status: 'ai_suggested',
      source: 'ai_vision',
      confidence: 0.88,
      features: {
        lengthNormalized: 0.5,
        relativeLength: 'Dài',
        visibleContrast: 'Rõ nét',
        curvature: 'Cong nhiều',
        breaksObserved: 'Không có',
        branchesObserved: 'Không có',
        intersections: []
      },
      canvasPath: [{ x: 0.4, y: 0.3 }, { x: 0.35, y: 0.6 }],
      uncertainRegions: [],
      limitations: []
    };
  });

  // Báo cáo khi chưa xác nhận
  const unverifiedReport = buildComprehensivePalmReport(
    'right',
    'right',
    'Ma Y Phái Thủ Tướng',
    initialLines,
    'Kim',
    true
  );

  const unverifiedCheck = unverifiedReport.linesAnalysis.every(l => 
    !l.verifiedByUser && l.classicalInterpretation.includes('Chưa hiển thị luận giải')
  );

  // Xác nhận Đường Sinh Đạo
  initialLines['sinh_dao'].userVerified = true;
  initialLines['sinh_dao'].status = 'user_verified';

  const verifiedReport = buildComprehensivePalmReport(
    'right',
    'right',
    'Ma Y Phái Thủ Tướng',
    initialLines,
    'Kim',
    true
  );

  const sinhDaoItem = verifiedReport.linesAnalysis.find(l => l.line.id === 'sinh_dao');
  const hasValidCitation = sinhDaoItem?.evidence?.ruleCode === 'RULE-PM-001' && Boolean(sinhDaoItem?.evidence?.pagePrinted?.includes('142'));

  results.push({
    id: 'palmistry-zero-ai-audit',
    name: 'Kiểm thử Báo Cáo Thủ Tướng 7 Phần & Chuẩn Tắc Khóa Luận Giải Chưa Xác Nhận',
    description: 'Chỉ đường đã được xác nhận mới được đối chiếu cổ thư (RULE-PM-001). Đường chưa xác nhận tuyệt đối không xuất lời phán mệnh lý.',
    input: { unverifiedCheck, hasValidCitation },
    expected: { unverifiedLocked: true, verifiedHasCitation: true },
    actual: { unverifiedLocked: unverifiedCheck, verifiedHasCitation: Boolean(hasValidCitation) },
    passed: unverifiedCheck === true && Boolean(hasValidCitation) && verifiedReport.auditTrail.verifiedRulesUsed.length >= 2
  });

  const passedCount = results.filter(r => r.passed).length;

  return {
    total: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
