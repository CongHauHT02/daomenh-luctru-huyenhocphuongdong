/**
 * ĐẠO MỆNH – NHÂN TƯỚNG HỌC & VÂN TAY (FACE & FINGERPRINT ENGINE)
 * Phân tích Tam Đình, Ngũ Nhạc, 12 Cung tướng diện & 3 hệ vân tay
 * Tôn trọng tuyệt đối quyền riêng tư: Xử lý cục bộ trên trình duyệt, không lưu ảnh khuôn mặt
 */

export interface FaceRegion {
  name: string;
  traditionalTerm: string;
  location: string;
  symbolism: string;
  analysisInsight: string;
}

export type FaceShapeElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface FaceShapeInfo {
  element: FaceShapeElement;
  nameVi: string;
  hanziName: string;
  facialCharacter: string;
  boneAndFlesh: string;
  classicalQuote: string;
  virtues: string[];
  blindSpots: string[];
  careerPath: string[];
}

export interface FaceHexagram {
  name: string;
  symbol: string;
  hanzi: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgement: string; // Thoán Từ
  imageMeaning: string; // Đại Tượng
  classicalInterpretation: string;
  actionGuidance: string;
}

export interface PalaceInsight {
  id: string;
  name: string;
  hanzi: string;
  location: string;
  aspect: string;
  classicalSignificance: string;
  favorableSigns: string;
  unfavorableSigns: string;
  currentAssessment: string;
}

export interface FaceReadingReport {
  timestamp: string;
  faceMetrics: {
    aspectRatio: number;
    upperRatio: number;
    middleRatio: number;
    lowerRatio: number;
    brightnessAverage: number;
    skinWarmth: 'Hoàng Minh (Vàng Sáng Nhuận)' | 'Hồng Nhuận (Hồng Sáng Vượng)' | 'Thanh Bạch (Trắng Sáng Thanh)' | 'Trầm Tĩnh (Nội Liễm)';
  };
  elementShape: FaceShapeInfo;
  hexagram: FaceHexagram;
  tamDinhVerdict: {
    upperStatus: { term: string; ageRange: string; rating: string; insight: string; classicalRule: string };
    middleStatus: { term: string; ageRange: string; rating: string; insight: string; classicalRule: string };
    lowerStatus: { term: string; ageRange: string; rating: string; insight: string; classicalRule: string };
    harmonyScore: number;
    harmonyVerdict: string;
  };
  keyPalaces: PalaceInsight[];
  khiSacInterpretation: {
    title: string;
    description: string;
    forecastPeriod: string;
    sourceBook: string;
  };
  cultivationAdvice: {
    coreMotto: string;
    explanation: string;
    threeActions: string[];
  };
}

export interface FingerprintPattern {
  id: 'whorl' | 'loop' | 'arch';
  nameVi: string;
  nameEn: string;
  symbol: string;
  prevalence: string;
  characteristics: string[];
  learningStyle: string;
  careerPotential: string[];
  culturalMetaphor: string;
  element: 'Kim' | 'Thủy' | 'Thổ';
  baguaTrigram: string;
}

export interface FingerprintReadingReport {
  whorlCount: number;
  loopCount: number;
  archCount: number;
  classicalPoem: {
    rhymeTitle: string;
    poemLines: string[];
    ancientMeaning: string;
  };
  hexagramDivination: {
    name: string;
    symbol: string;
    overview: string;
  };
  temperamentProfile: {
    title: string;
    strengths: string[];
    developmentFocus: string[];
    careerDirection: string[];
  };
  baguaFingers: Array<{
    fingerName: string;
    hand: 'Trái' | 'Phải';
    pattern: 'whorl' | 'loop' | 'arch';
    baguaSignificance: string;
    classicDomain: string;
  }>;
  cultivationRule: string;
}

// ----------------------------------------------------
// DỮ LIỆU CỔ THƯ: NGŨ HÀNH DIỆN TƯỚNG (MA Y THẦN TƯỚNG)
// ----------------------------------------------------
export const FACE_SHAPES_CATALOG: Record<FaceShapeElement, FaceShapeInfo> = {
  Kim: {
    element: 'Kim',
    nameVi: 'Kim Hình Diện (Mặt Chữ Điền)',
    hanziName: '金形正方 • 田字面',
    facialCharacter: 'Khuôn mặt vuông vắn, trán vuông, cằm vuông, xương gò má vừa phải, đường nét đoan chính dứt khoát.',
    boneAndFlesh: 'Cốt cách vững vàng, thịt săn chắc không phù thũng, sắc da thanh bạch hoặc hoàng bạch quang trạch.',
    classicalQuote: '《Ma Y Thần Tướng》 viết: "Kim hình diện phương, cốt tiết nghiêm cẩn, thanh âm hồng lượng, chủ cương trực đại tiết, chấp chưởng quyền bính."',
    virtues: ['Tính cách quả quyết, giữ chữ tín hàng đầu', 'Tư duy logic, kỷ luật tự giác cao', 'Có năng lực làm chủ tình thế và quản trị tổ chức'],
    blindSpots: ['Đôi khi quá cứng rắn, thiếu sự uyển chuyển nhu hòa', 'Dễ tự tạo áp lực cầu toàn cho bản thân và người xung quanh'],
    careerPath: ['Quản lý điều hành', 'Tài chính - Ngân hàng', 'Quân sự - Pháp luật', 'Kiến trúc - Cơ khí chính xác']
  },
  Mộc: {
    element: 'Mộc',
    nameVi: 'Mộc Hình Diện (Mặt Chữ Giáp / Đồng)',
    hanziName: '木形修長 • 甲字面',
    facialCharacter: 'Khuôn mặt thon dài thanh tú, trán cao rộng, xương mũi thẳng dài, cằm hơi thuôn nhưng không nhọn hoắt.',
    boneAndFlesh: 'Cốt cách thanh nhã, gân cốt ẩn tàng, sắc diện thanh nhuận (hơi phớt sắc xanh ngọc sáng).',
    classicalQuote: '《Thần Tướng Toàn Biên》 viết: "Mộc hình diện trường, mi thanh mục tú, cốt tiết thanh thuần, chủ thông minh văn bác, hiển đạt khoa giáp."',
    virtues: ['Tư duy nhân từ, lòng trắc ẩn sâu sắc', 'Khả năng sáng tạo và học thức uyên bác', 'Nhìn xa trông rộng, có tầm nhìn chiến lược'],
    blindSpots: ['Dễ suy nghĩ quá nhiều, tâm thần hao tổn', 'Đôi khi thiếu tính quyết đoán dứt điểm trong việc thực thi'],
    careerPath: ['Nghiên cứu khoa học', 'Giáo dục - Đào tạo', 'Văn hóa - Nghệ thuật', 'Y tế - Dược học']
  },
  Thủy: {
    element: 'Thủy',
    nameVi: 'Thủy Hình Diện (Mặt Chữ Viên)',
    hanziName: '水形圓厚 • 圓字面',
    facialCharacter: 'Khuôn mặt tròn đầy đặn, cằm tròn no đủ, tai dày có dái tai lớn rủ xuống, đường nét mềm mại phúc hậu.',
    boneAndFlesh: 'Thịt đẫy đà nhưng chắc chắn, sắc diện nhu nhuận sáng bóng như phủ lớp nước thanh.',
    classicalQuote: '《Liễu Trang Thần Tướng》 viết: "Thủy hình diện viên, nhục hậu sắc quang trạch, chủ linh hoạt biến hóa, đa mưu túc trí, kinh thương đại phú."',
    virtues: ['Khả năng thích nghi môi trường cực tốt', 'Giao tế rộng lượng, biết lắng nghe thấu hiểu', 'Tài vận tích lũy tự nhiên, có duyên với thương trường'],
    blindSpots: ['Dễ xuề xòa, thiếu sự kiên định vào những thời điểm then chốt', 'Dễ bị cảm xúc chi phối nếu thiếu mục tiêu rõ ràng'],
    careerPath: ['Kinh doanh thương mại', 'Ngoại giao - Quan hệ công chúng', 'Logistics - Vận tải', 'Tư vấn chiến lược']
  },
  Hỏa: {
    element: 'Hỏa',
    nameVi: 'Hỏa Hình Diện (Mặt Chữ Mục / Tiêm)',
    hanziName: '火形尖露 • 目字面',
    facialCharacter: 'Khuôn mặt phần trên rộng hoặc giữa nở, cằm hơi nhọn, mắt sáng có thần, đường nét góc cạnh linh hoạt.',
    boneAndFlesh: 'Cốt lộ rõ, sắc khí hồng hào sáng sủa, thần thái linh hoạt, cử chỉ nhanh nhẹn.',
    classicalQuote: '《Ma Y Thần Tướng》 viết: "Hỏa hình diện tiêm, mục quang như điện, chủ nhiệt tâm dũng liệt, tốc phát tốc thành, công danh hiển hách."',
    virtues: ['Nhiệt huyết tràn đầy, tinh thần tiên phong dũng cảm', 'Khả năng truyền cảm hứng và lôi cuốn đám đông', 'Phản ứng nhanh nhạy trước cơ hội mới'],
    blindSpots: ['Tính khí đôi lúc nóng nảy, thiếu sự nhẫn nại đường dài', 'Dễ bốc đồng khi gặp điều không như ý'],
    careerPath: ['Truyền thông - Khởi nghiệp', 'Sân khấu - Nghệ thuật biểu diễn', 'Tiếp thị - Bán hàng tiên phong', 'Ẩm thực - Năng lượng']
  },
  Thổ: {
    element: 'Thổ',
    nameVi: 'Thổ Hình Diện (Mặt Chữ Quốc / Vương)',
    hanziName: '土形敦厚 • 國字面',
    facialCharacter: 'Khuôn mặt dày dặn, cằm vuông rộng, mũi dày nở (Chuẩn đầu nở nang), ngũ quan trầm tĩnh uy nghiêm.',
    boneAndFlesh: 'Cốt nhục tương xứng, thịt dày chắc, sắc diện hoàng minh (vàng sáng đất mẹ) ấm áp.',
    classicalQuote: '《Thần Tướng Toàn Biên》 viết: "Thổ hình diện đôn hậu, tỵ đại nhĩ hậu, sắc hoàng tĩnh định, chủ thành tín ổn trọng, điền trạch cự vượng."',
    virtues: ['Đôn hậu trung chính, lấy sự vững chãi làm gốc', 'Được người khác tuyệt đối tín nhiệm, trọng ân nghĩa', 'Khả năng giữ gìn và phát triển tài sản bền bỉ'],
    blindSpots: ['Đôi khi phản ứng hơi chậm trước biến động thời cuộc', 'Ít khi bộc lộ cảm xúc khiến người khác khó thấu hiểu'],
    careerPath: ['Bất động sản - Xây dựng', 'Nông nghiệp công nghệ cao', 'Hành chính quản trị', 'Kho vận - Khai thác tài nguyên']
  }
};

// ----------------------------------------------------
// DỮ LIỆU CỔ THƯ: QUẺ DỊCH TƯỚNG DIỆN
// ----------------------------------------------------
export const FACE_HEXAGRAMS_CATALOG: FaceHexagram[] = [
  {
    name: 'Địa Thiên Thái',
    symbol: '䷊',
    hanzi: '地天泰',
    upperTrigram: 'Khôn (Địa - Đất / Hạ Đình củng cố)',
    lowerTrigram: 'Càn (Thiên - Trời / Thượng Đình quang minh)',
    judgement: 'Thái: Tiểu vãng đại lai, cát hanh. Khí trời hạ xuống, khí đất bốc lên, âm dương giao hòa, muôn vật sinh sôi.',
    imageMeaning: 'Trời đất giao cảm là tượng quẻ Thái. Tướng mạo Thượng Đình sáng sủa gặp Hạ Đình nở nang, chủ tiền đồ rộng mở, trong ấm ngoài êm.',
    classicalInterpretation: 'Người có tướng diện ứng quẻ Thái sở hữu tư duy tiên thiên thông tuệ, trung niên tự lập đại nghiệp, hậu vận hưởng phúc lộc sum vầy.',
    actionGuidance: 'Lấy đức khiêm hạ để giữ thế thịnh trị; chia sẻ phúc lộc cho người yếu thế để phúc thọ vững bền.'
  },
  {
    name: 'Hỏa Thiên Đại Hữu',
    symbol: '䷍',
    hanzi: '火天大有',
    upperTrigram: 'Ly (Hỏa - Lửa / Thần sắc quang huy)',
    lowerTrigram: 'Càn (Thiên - Trời / Ý chí kiên định)',
    judgement: 'Đại Hữu: Nguyên hanh. Lửa ở trên trời, ánh sáng chiếu rọi khắp nơi, chứa chan muôn vật, đại phú đại quý.',
    imageMeaning: 'Lửa trên trời là tượng quẻ Đại Hữu. Sắc diện hồng hào quang minh, ánh mắt tự tin, chủ đắc tài đắc lộc, quý nhân trợ vận.',
    classicalInterpretation: 'Tướng diện toát lên vẻ vượng khí, sớm được cấp trên tin cẩn, nắm quyền quản lý ngân xuyến hoặc đứng đầu tổ chức.',
    actionGuidance: 'Thuận thiên ưng thời, dẹp bỏ tính kiêu ngạo; dùng tài sản vào việc thiện lương để tích lũy âm đức bền lâu.'
  },
  {
    name: 'Thiên Phong Cấu',
    symbol: '䷫',
    hanzi: '天風姤',
    upperTrigram: 'Càn (Thiên - Ý chí cao xa)',
    lowerTrigram: 'Tốn (Phong - Linh hoạt ứng biến)',
    judgement: 'Cấu: Nữ tráng, vật dụng thủ nữ. Gió thổi dưới trời, gặp gỡ bất ngờ, cơ hội đến từ sự kết giao.',
    imageMeaning: 'Gió đi dưới gầm trời là tượng quẻ Cấu. Tướng diện thể hiện tính năng động, ngoại giao tài ba, nhiều nhân duyên bất ngờ.',
    classicalInterpretation: 'Dễ gặt hái thành công ngoài dự kiến nhờ những mối lương duyên tao ngộ; cần giữ gìn lòng chung thủy và chữ tín hàng đầu.',
    actionGuidance: 'Cẩn trọng trong việc chọn bạn đồng hành; phân biệt rõ cơ hội chân chính và cạm bẫy hư ảo.'
  },
  {
    name: 'Sơn Hỏa Bí',
    symbol: '䷕',
    hanzi: '山火賁',
    upperTrigram: 'Cấn (Sơn - Núi / Trầm ổn kiên định)',
    lowerTrigram: 'Ly (Hỏa - Lửa / Văn hóa trí tuệ)',
    judgement: 'Bí: Hanh, tiểu lợi hữu du vãng. Dưới núi có lửa, vẻ đẹp văn chất tương tể, trong sáng ngoài thuần.',
    imageMeaning: 'Lửa dưới chân núi là tượng quẻ Bí. Tướng diện thanh tú đoan trang, lời nói hòa nhã, có duyên văn chương học thuật.',
    classicalInterpretation: 'Chủ học thức uyên thâm, thích sự tinh tế tao nhã; công danh phát triển rực rỡ trong các lĩnh vực nghiên cứu, văn hóa, nghệ thuật.',
    actionGuidance: 'Trọng thực chất hơn vẻ hào nhoáng bên ngoài; lấy nhân tâm bồi đắp tài năng.'
  },
  {
    name: 'Phong Lôi Ích',
    symbol: '䷩',
    hanzi: '風雷益',
    upperTrigram: 'Tốn (Phong - Gió)',
    lowerTrigram: 'Chấn (Lôi - Sấm sét / Khởi động)',
    judgement: 'Ích: Lợi hữu du vãng, lợi thiệp đại xuyên. Gió sấm trợ lực nhau, ngày một tăng tiến không ngừng.',
    imageMeaning: 'Gió và sấm cùng hợp sức là tượng quẻ Ích. Tướng mạo thể hiện chí tiến thủ mãnh liệt, không ngại gian khó thử thách.',
    classicalInterpretation: 'Tuổi trẻ có thể vất vả lập thân, nhưng càng về sau càng tăng tiến cả về tài lộc lẫn vị thế xã hội.',
    actionGuidance: 'Thấy điều thiện thì tiến tới, thấy lỗi lầm thì sửa ngay; mở lòng bao dung nâng đỡ kẻ dưới.'
  },
  {
    name: 'Thuần Khôn',
    symbol: '䷁',
    hanzi: '坤為地',
    upperTrigram: 'Khôn (Địa - Đất mẹ)',
    lowerTrigram: 'Khôn (Địa - Đất mẹ)',
    judgement: 'Khôn: Nguyên hanh, lợi tẫn mã chi trinh. Hậu đức tải vật, bao dung nâng đỡ muôn loài, vạn sự thành tựu nhờ lòng kiên nhẫn.',
    imageMeaning: 'Đất dày chở muôn vật là tượng quẻ Khôn. Tướng diện đôn hậu, ánh mắt nhân từ, cằm nở phúc hậu, chủ gia đạo hưng thịnh.',
    classicalInterpretation: 'Người mang tướng Khôn đức độ hiền hòa, tích lũy âm đức sâu dày, con cháu hiếu thảo thành đạt, một đời an nhiên.',
    actionGuidance: 'Kiên trì phụng sự, không tranh giành danh lợi nhất thời; thời gian sẽ chứng minh giá trị chân chính.'
  }
];

// ----------------------------------------------------
// DỮ LIỆU CỔ THƯ: 12 CUNG DIỆN TƯỚNG (THẦN TƯỚNG TOÀN BIÊN)
// ----------------------------------------------------
export const TWELVE_PALACES_CATALOG: PalaceInsight[] = [
  {
    id: 'menh',
    name: 'Cung Mệnh',
    hanzi: '命宮 • 印堂',
    location: 'Ấn Đường – Khu vực giữa hai đầu lông mày',
    aspect: 'Chủ về tâm tư, hoài bão, trí tuệ tiên thiên và vận trình tổng quan hiện tại.',
    classicalSignificance: '《Ma Y Thần Tướng》 viết: "Ấn Đường bình chính, khoan khoát như gương, chủ thông minh quán thế, một đời hanh thông vô tai ách."',
    favorableSigns: 'Khoảng cách giữa hai chân mày rộng chừng 2 ngón tay, sáng sủa, nhẵn mịn, không có nốt ruồi ác hay vết cắt nếp nhăn trảm tự.',
    unfavorableSigns: 'Lông mày mọc giao nhau che lấp Ấn Đường, sắc khí xám xịt hoặc có sẹo lõm (chủ tâm tư u uất, dễ gặp trắc trở).',
    currentAssessment: 'Khu vực Ấn Đường quang nhuận, khí sắc bình ổn thể hiện tinh thần sáng suốt, tâm thái an định để đón nhận thời cơ mới.'
  },
  {
    id: 'quan_loc',
    name: 'Cung Quan Lộc',
    hanzi: '官祿宮 • 中正',
    location: 'Chính giữa trán (Trung Chính, Thiên Đình)',
    aspect: 'Chủ về công danh sự nghiệp, mối quan hệ với cấp trên và cơ hội thăng tiến.',
    classicalSignificance: '《Thần Tướng Toàn Biên》 viết: "Trung Chính quang trạch, vô hãm vô ban, chủ chức vị cao thăng, quý nhân nâng đỡ."',
    favorableSigns: 'Xương trán nhô nhẹ như vầng trăng khuyết (Nhật Nguyệt Giác triều củng), da trán căng sáng, không gồ ghề.',
    unfavorableSigns: 'Trán vẹt, có vết sẹo sâu hoặc lồi lõm thất thường (chủ đường công danh nhiều biến động thời niên thiếu).',
    currentAssessment: 'Khu vực Trung Chính cao ráo, khí sắc sáng rõ báo hiệu năng lực quản trị công việc vững vàng và được tín nhiệm.'
  },
  {
    id: 'tai_bach',
    name: 'Cung Tài Bạch',
    hanzi: '財帛宮 • 準頭',
    location: 'Chóp mũi (Chuẩn Đầu) và hai cánh mũi (Gián Đài, Đình Úy)',
    aspect: 'Chủ về tài lộc, năng lực kinh doanh, khả năng tích lũy tiền bạc và tài sản.',
    classicalSignificance: '《Liễu Trang Thần Tướng》: "Chuẩn đầu phong viên, Gián Đài Đình Úy tương xứng, tài bảo sung mãn, chung thân y thực phong doanh."',
    favorableSigns: 'Chuẩn đầu tròn đầy đặn như túi mật treo (Huyền Đảm), hai cánh mũi dày khép kín, không lộ lỗ mũi khi nhìn chính diện.',
    unfavorableSigns: 'Sống mũi gãy khúc, cánh mũi mỏng manh trơ xương hoặc lỗ mũi quá hếch (chủ tiền vào nhanh nhưng ra cũng chóng).',
    currentAssessment: 'Cung Tài Bạch cân đối, bờ cánh mũi bao bọc vững chắc biểu trưng cho năng lực quản lý ngân sách và tài sản thực tế.'
  },
  {
    id: 'phu_the',
    name: 'Cung Phu Thê',
    hanzi: '夫妻宮 • 姦門',
    location: 'Khu vực đuôi mắt và vùng thái dương (Gian Môn)',
    aspect: 'Chủ về nhân duyên, tình cảm lứa đôi, sự hòa hợp vợ chồng và phúc đức gia đạo.',
    classicalSignificance: '《Ma Y Thần Tướng》 viết: "Gian Môn quang nhuận, vô hoa văn tỳ vết, phu thê hòa mục, tương kính như tân."',
    favorableSigns: 'Đuôi mắt đầy đặn, sắc da sáng mịn, đường nếp nhăn đuôi mắt (ngư vĩ) ngay ngắn thanh tú.',
    unfavorableSigns: 'Vùng Gian Môn trũng sâu, có nốt ruồi đen hung hiểm hoặc nhiều vết cắt đan chéo (chủ duyên nợ nhiều trắc trở).',
    currentAssessment: 'Khu vực Gian Môn bằng phẳng, sắc diện nhu hòa dự báo đường tình cảm êm ấm, vợ chồng đồng lòng vượt qua sóng gió.'
  },
  {
    id: 'dien_trach',
    name: 'Cung Điền Trạch',
    hanzi: '田宅宮 • 眼瞼',
    location: 'Khoảng cách giữa bờ mi mắt trên và cung lông mày',
    aspect: 'Chủ về tài sản bất động sản, nhà cửa đất đai và sự khoáng đạt của nội tâm.',
    classicalSignificance: '《Thần Tướng Toàn Biên》: "Điền Trạch khoan quảng, mục quang trừng triệt, gia tư điền sản quảng đại, hưởng phúc ấm tổ tiên."',
    favorableSigns: 'Khoảng cách mí mắt rộng rãi, da mắt căng mịn sáng sủa, ánh mắt ấm áp trong sáng.',
    unfavorableSigns: 'Mí mắt quá hẹp (chân mày áp sát mắt) hoặc có sẹo rách (chủ duyên nhà đất đến muộn, tâm tính dễ nóng vội).',
    currentAssessment: 'Cung Điền Trạch rộng mở, khoảng cách đoan chính cho thấy tâm tính khoáng đạt, có duyên tạo dựng nhà cửa khang trang.'
  }
];

export const FINGERPRINT_PATTERNS: FingerprintPattern[] = [
  {
    id: 'whorl',
    nameVi: 'Vân Xoáy (Hoa Tay / Đại Bàng / Thái Cực Vân)',
    nameEn: 'Whorl Pattern',
    symbol: '◎',
    prevalence: 'Khoảng 30% - 35% dân số',
    characteristics: [
      'Mục tiêu rõ ràng, ý chí tự chủ cao, quyết đoán dũng mãnh',
      'Thích độc lập hành động, ít bị chi phối bởi dư luận bên ngoài',
      'Đòi hỏi tiêu chuẩn cao ở bản thân và cấp dưới',
      'Có xu hướng tiên phong khai phá những con đường mới'
    ],
    learningStyle: 'Tự định hướng, học qua việc làm chủ mục tiêu và giải quyết thử thách có độ khó cao.',
    careerPotential: ['Lãnh đạo khởi nghiệp', 'Quản trị chiến lược', 'Chuyên gia nghiên cứu độc lập', 'Kiến trúc sư', 'Chỉ huy dự án'],
    culturalMetaphor: 'Người xưa gọi là "Vân Hoa Tay" hay "Thái Cực Vân", tượng trưng cho sự tụ khí, đĩnh đạc và bản lĩnh lập thân.',
    element: 'Kim',
    baguaTrigram: 'Càn (Trời / Cương kiện)'
  },
  {
    id: 'loop',
    nameVi: 'Vân Móc (Vân Nước / Dòng Chảy / Khảm Thủy Vân)',
    nameEn: 'Loop Pattern',
    symbol: '∿',
    prevalence: 'Khoảng 60% - 65% dân số',
    characteristics: [
      'Khả năng thích ứng môi trường tuyệt vời, tùy cơ ứng biến',
      'Hòa nhã, cởi mở, biết lắng nghe và thấu cảm sâu sắc',
      'Học hỏi nhanh thông qua sao chép, tương tác và mô phỏng',
      'Đề cao sự hòa thuận và tinh thần đồng đội trong tập thể'
    ],
    learningStyle: 'Học thông qua giao lưu đội nhóm, thảo luận tương tác và trải nghiệm thực tế sinh động.',
    careerPotential: ['Ngoại giao - Đàm phán', 'Giáo dục & Đào tạo', 'Truyền thông quan hệ công chúng', 'Tư vấn dịch vụ cao cấp'],
    culturalMetaphor: 'Tượng trưng cho dòng nước nhu hòa, gặp bình tròn thì tròn, gặp bình vuông thì vuông; chảy êm đềm nhưng có sức mài mòn đá sỏi.',
    element: 'Thủy',
    baguaTrigram: 'Khảm (Nước / Thông tuệ)'
  },
  {
    id: 'arch',
    nameVi: 'Vân Cung (Vân Núi / Bậc Thang / Cấn Thổ Vân)',
    nameEn: 'Arch Pattern',
    symbol: '⋀',
    prevalence: 'Khoảng 5% dân số (Dạng hiếm)',
    characteristics: [
      'Thận trọng, chắc chắn, từng bước vững chãi như núi thái sơn',
      'Trọng chứng cứ thực tế, tôn trọng sự thật khách quan, không viển vông',
      'Trung thành, kiên định và có sức chịu đựng áp lực phi thường',
      'Cần thời gian tiếp nhận thông tin mới nhưng khi đã hiểu thì nhớ rất sâu'
    ],
    learningStyle: 'Quy trình hóa từng bước, cần tài liệu hệ thống và bằng chứng cụ thể rõ ràng trước khi hành động.',
    careerPotential: ['Tài chính kiểm toán', 'Kỹ thuật công nghệ chính xác', 'Pháp lý luật học', 'Quản lý chất lượng vận hành'],
    culturalMetaphor: 'Ví như núi Thái Sơn sừng sững, không dao động trước phong ba bão táp; hậu tích bạc phát, càng lâu càng vững.',
    element: 'Thổ',
    baguaTrigram: 'Cấn (Núi / Kiên định)'
  }
];

export const FACE_REGIONS: FaceRegion[] = [
  {
    name: 'Thượng Đình',
    traditionalTerm: 'Thiên Đình (Trán & Chân Tóc)',
    location: 'Từ chân tóc đến điểm giao hai cung lông mày (Ấn Đường)',
    symbolism: 'Đại diện cho tư duy, trí tuệ tiên thiên, phúc đức tổ phụ, học vấn và vận thế thời niên thiếu (15 - 30 tuổi).',
    analysisInsight: 'Trán cao rộng, sắc khí sáng sủa thể hiện tư duy khoáng đạt, sớm được gia đình và quý nhân nâng đỡ trên con đường học vấn công danh.'
  },
  {
    name: 'Trung Đình',
    traditionalTerm: 'Nhân Đình (Chuẩn Đầu, Lưỡng Quyền, Mắt, Tai)',
    location: 'Từ lông mày đến chóp mũi (Chuẩn đầu)',
    symbolism: 'Đại diện cho ý chí, nghị lực tự thân, sự nghiệp, tài lộc, hôn nhân và vận thế trung niên (31 - 50 tuổi).',
    analysisInsight: 'Sống mũi thẳng thắn, cánh mũi dày dặn cân đối là tướng cách của người có năng lực quản trị tài chính, quả cảm và tự lập đại nghiệp.'
  },
  {
    name: 'Hạ Đình',
    traditionalTerm: 'Địa Các (Nhân trung, Miệng, Cằm)',
    location: 'Từ dưới chóp mũi đến đáy cằm',
    symbolism: 'Đại diện cho lòng bao dung, tài sản tích lũy, con cái, cấp dưới và hậu vận tuổi già (51 tuổi trở đi).',
    analysisInsight: 'Cằm đầy đặn nở nang, nhân trung sâu dài thể hiện sinh lực dồi dào, hậu vận thanh thản ấm êm bên người thân và con cháu hiếu thuận.'
  }
];

// ----------------------------------------------------
// CA QUYẾT DÂN GIAN & CỔ TỊCH 10 HOA TAY (ĐẦU KHÍ THỦ TƯỚNG)
// ----------------------------------------------------
export const WHORL_POEMS_CATALOG: Record<number, { title: string; lines: string[]; ancientMeaning: string }> = {
  0: {
    title: 'Thập Chỉ Toàn Lưu (0 Hoa Tay - Dòng Chảy Nhu Hòa)',
    lines: [
      'Thập chỉ toàn lưu vô nhất hoa,',
      'Bạch thủ thành gia tiếu ngạo tha.',
      'Tự lập tự cường tâm bất hoảng,',
      'Trung niên y thực tự phong hoa.'
    ],
    ancientMeaning: 'Mười ngón đều là vân nước, không có hoa tay: Người này xuất thân giản dị, tự lực cánh sinh từ hai bàn tay trắng. Tâm tính nhu hòa, thích ứng thời cuộc cực giỏi, hậu vận giàu có vững bền nhờ sự cần cù nhẫn nại.'
  },
  1: {
    title: 'Nhất Hoa Độc Tú (1 Hoa Tay - Ý Chí Tiên Phong)',
    lines: [
      'Nhất hoa độc tú định càn khôn,',
      'Dũng cảm tiên phong chí khí tôn.',
      'Dù trải gian nan thời niên thiếu,',
      'Hậu vận vinh hoa rạng cửa môn.'
    ],
    ancientMeaning: 'Một hoa tay lẻ loi mà vững vàng: Tuổi trẻ trải qua nhiều tôi luyện thử thách, tính cách kiên định không sợ gian khó. Trung vận có bước ngoặt lớn, lập nên công trạng bằng chính năng lực thực thụ.'
  },
  2: {
    title: 'Nhị Hoa Song Hành (2 Hoa Tay - Quý Nhân Tương Trợ)',
    lines: [
      'Nhị hoa song hành quý nhân phù,',
      'Tài trí song toàn tứ hải du.',
      'Bằng hữu tương trợ thành đại sự,',
      'Gia đạo hưng thịnh tước lộc dư.'
    ],
    ancientMeaning: 'Hai hoa tay phối hợp: Tướng người có duyên kết giao, lời nói có trọng lượng, đi đâu cũng được người yêu kẻ mến. Công việc kinh doanh thuận buồm xuôi gió nhờ mạng lưới bạn hữu đắc lực.'
  },
  3: {
    title: 'Tam Dương Khai Thái (3 Hoa Tay - Đa Mưu Túc Trí)',
    lines: [
      'Tam hoa tam hợp thế như phong,',
      'Mưu sự chu toàn hiển cổ công.',
      'Khéo léo ngoại giao thông vạn sự,',
      'Trung vận hanh thông phú quý nồng.'
    ],
    ancientMeaning: 'Ba hoa tay tượng trưng cho Tam Tài (Thiên - Địa - Nhân): Người có tư duy nhạy bén, biết nắm bắt thời cơ, giỏi xoay xở và đàm phán. Càng về trung niên càng tích tụ tài sản dồi dào.'
  },
  4: {
    title: 'Tứ Quý Bình An (4 Hoa Tay - Điền Trạch Sung Túc)',
    lines: [
      'Tứ hoa tài lộc tụ tứ phương,',
      'Tính tình đôn hậu trọng kỷ cương.',
      'Tích tiểu thành đại điền trạch vượng,',
      'An khang trường thọ hưởng phúc trường.'
    ],
    ancientMeaning: 'Bốn hoa tay tương ứng Tứ Quý: Tính tình trung hậu, làm việc chắc chắn, không tham lam liều lĩnh. Có duyên với đất đai nhà cửa, tích lũy của cải bền vững qua năm tháng.'
  },
  5: {
    title: 'Ngũ Phúc Lâm Môn (5 Hoa Tay - Bậc Quân Tử Trọng Nghĩa)',
    lines: [
      'Ngũ hoa ngũ phúc thọ khang ninh,',
      'Ý chí kiên định bậc anh minh.',
      'Tiền hung hậu cát vinh hoa đến,',
      'Con cháu công danh rạng bóng hình.'
    ],
    ancientMeaning: 'Năm hoa tay mang khí chất Ngũ Hành cân xứng: Người có lòng tự trọng cao, luôn bảo vệ danh dự gia đình. Tiền vận có thể thăng trầm nhưng trung và hậu vận phúc khí viên mãn.'
  },
  6: {
    title: 'Lục Hợp Đồng Tâm (6 Hoa Tay - Quản Trị Đại Nghiệp)',
    lines: [
      'Lục hoa đại cát chí khí cao,',
      'Vượt sóng trùng khơi đón phong trào.',
      'Quản trị kinh doanh tay nắm vững,',
      'Tài danh vang dội bậc hào đào.'
    ],
    ancientMeaning: 'Sáu hoa tay ứng với Lục Hợp: Khí phách lãnh đạo rõ nét, tham vọng lớn lao, có tầm nhìn chiến lược. Thích hợp đứng đầu tổ chức hoặc làm chủ doanh nghiệp quy mô.'
  },
  7: {
    title: 'Thất Tinh Bắc Đẩu (7 Hoa Tay - Trí Tuệ Siêu Quần)',
    lines: [
      'Thất hoa thất tinh chiếu mệnh đình,',
      'Mưu lược uyên thâm dạ chí minh.',
      'Lãnh đạo chỉ huy tài xuất chúng,',
      'Công thành danh toại rạng bình minh.'
    ],
    ancientMeaning: 'Bảy hoa tay tựa chòm sao Bắc Đẩu: Đầu óc thông minh, trực giác sắc bén, nội tâm kiên định phi thường. Có duyên với các chức vụ chỉ huy, nghiên cứu sâu sắc hoặc chuyên gia đầu ngành.'
  },
  8: {
    title: 'Bát Tiên Quá Hải (8 Hoa Tay - Phong Đô Lạc Quan)',
    lines: [
      'Bát hoa phong phú vận thời hưng,',
      'Biến hóa khôn lường tựa gió rừng.',
      'Vận thế hanh thông đa diện phát,',
      'Phúc lộc song toàn sáng dặm chừng.'
    ],
    ancientMeaning: 'Tám hoa tay tượng Bát Quái chu lưu: Con người đa tài, phong lưu tao nhã, phản ứng tình huống cực nhanh. Cuộc sống muôn màu muôn vẻ, hậu vận thảnh thơi an nhàn.'
  },
  9: {
    title: 'Cửu Trùng Thiên Hỷ (9 Hoa Tay - Tôn Quý Danh Vọng)',
    lines: [
      'Cửu hoa tôn quý bậc kỳ tài,',
      'Nhân nghĩa trung kiên vẹn cả hai.',
      'Danh tiếng lưu truyền vang bốn cõi,',
      'Gia phong thịnh vượng ấm lâu dài.'
    ],
    ancientMeaning: 'Chín hoa tay là số dương cực đại: Người có khí phách trác tuyệt, lời nói có sức thuyết phục ngàn người. Rất sớm khẳng định được tên tuổi và uy tín trong cộng đồng.'
  },
  10: {
    title: 'Thập Toàn Thập Mỹ (10 Hoa Tay - Càn Khôn Đại Định)',
    lines: [
      'Thập hoa thập mỹ tụ càn khôn,',
      'Phúc đức tổ tông vạn thế tôn.',
      'Trí tuệ phi phàm tâm đại lượng,',
      'Phú quý trường xuân diệu thế môn.'
    ],
    ancientMeaning: 'Mười ngón đều là hoa tay (Thái Cực Toàn Bàn): Dạng hiếm có trong thiên hạ. Người này có tâm lượng bao la, ý chí sắt đá, làm việc gì cũng kiên trì đến cùng. Một đời đại phú đại quý, phúc thọ miên trường.'
  }
};

// ----------------------------------------------------
// THUẬT TOÁN ĐO LƯỜNG VÀ PHÁT QUẺ TỪ ẢNH KHUÔN MẶT
// ----------------------------------------------------
export async function analyzeFaceCanvasImage(imageSource: string): Promise<FaceReadingReport> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Create offscreen canvas for pixel analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const targetW = 240;
      const targetH = Math.round((targetW * img.height) / img.width);
      canvas.width = targetW;
      canvas.height = targetH;

      if (!ctx) {
        // Fallback default
        resolve(generateDefaultFaceReport(1.3, 0.33, 0.33, 0.34, 130, 'Hoàng Minh (Vàng Sáng Nhuận)'));
        return;
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const pixels = imgData.data;

      let totalR = 0, totalG = 0, totalB = 0;
      let topBrightness = 0, midBrightness = 0, botBrightness = 0;
      let topCount = 0, midCount = 0, botCount = 0;

      const oneThird = Math.floor(targetH / 3);
      const twoThird = Math.floor((targetH * 2) / 3);

      for (let y = 0; y < targetH; y++) {
        for (let x = 0; x < targetW; x++) {
          const idx = (y * targetW + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          totalR += r;
          totalG += g;
          totalB += b;

          if (y < oneThird) {
            topBrightness += lum;
            topCount++;
          } else if (y < twoThird) {
            midBrightness += lum;
            midCount++;
          } else {
            botBrightness += lum;
            botCount++;
          }
        }
      }

      const totalPixels = targetW * targetH;
      const avgR = totalR / totalPixels;
      const avgG = totalG / totalPixels;
      const avgB = totalB / totalPixels;
      const avgLum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

      const topAvg = topCount ? topBrightness / topCount : 128;
      const midAvg = midCount ? midBrightness / midCount : 128;
      const botAvg = botCount ? botBrightness / botCount : 128;
      const sumAvg = topAvg + midAvg + botAvg || 1;

      const upperRatio = Number((topAvg / sumAvg).toFixed(3));
      const middleRatio = Number((midAvg / sumAvg).toFixed(3));
      const lowerRatio = Number((botAvg / sumAvg).toFixed(3));
      const aspectRatio = Number((img.height / img.width).toFixed(2));

      // Sắc khí nhận diện
      let skinWarmth: FaceReadingReport['faceMetrics']['skinWarmth'] = 'Hoàng Minh (Vàng Sáng Nhuận)';
      if (avgR > avgG && avgR > avgB + 20) {
        skinWarmth = 'Hồng Nhuận (Hồng Sáng Vượng)';
      } else if (avgB > avgG && avgB > 110) {
        skinWarmth = 'Thanh Bạch (Trắng Sáng Thanh)';
      } else if (avgLum < 95) {
        skinWarmth = 'Trầm Tĩnh (Nội Liễm)';
      }

      resolve(generateDefaultFaceReport(aspectRatio, upperRatio, middleRatio, lowerRatio, avgLum, skinWarmth));
    };

    img.onerror = () => {
      resolve(generateDefaultFaceReport(1.3, 0.33, 0.33, 0.34, 130, 'Hoàng Minh (Vàng Sáng Nhuận)'));
    };

    img.src = imageSource;
  });
}

export function generateDefaultFaceReport(
  aspectRatio: number,
  upperRatio: number,
  middleRatio: number,
  lowerRatio: number,
  avgLum: number,
  skinWarmth: FaceReadingReport['faceMetrics']['skinWarmth']
): FaceReadingReport {
  // 1. Xác định Ngũ Hành Hình Tướng
  let element: FaceShapeElement = 'Kim';
  if (aspectRatio > 1.38) {
    element = 'Mộc';
  } else if (aspectRatio < 1.15) {
    element = 'Thủy';
  } else if (upperRatio > 0.36 && lowerRatio < 0.30) {
    element = 'Hỏa';
  } else if (lowerRatio > 0.35 || aspectRatio >= 1.15 && aspectRatio <= 1.25) {
    element = 'Thổ';
  } else {
    element = 'Kim';
  }
  const elementShape = FACE_SHAPES_CATALOG[element];

  // 2. Chọn Quẻ Dịch Tướng Diện
  let hexagramIndex = 0;
  if (element === 'Thổ' || lowerRatio > 0.34) {
    hexagramIndex = 0; // Địa Thiên Thái
  } else if (skinWarmth.includes('Hồng Nhuận') || element === 'Hỏa') {
    hexagramIndex = 1; // Hỏa Thiên Đại Hữu
  } else if (element === 'Mộc') {
    hexagramIndex = 3; // Sơn Hỏa Bí
  } else if (element === 'Thủy') {
    hexagramIndex = 2; // Thiên Phong Cấu
  } else if (element === 'Kim') {
    hexagramIndex = 4; // Phong Lôi Ích
  } else {
    hexagramIndex = 5; // Thuần Khôn
  }
  const hexagram = FACE_HEXAGRAMS_CATALOG[hexagramIndex % FACE_HEXAGRAMS_CATALOG.length];

  // 3. Phân định Tam Đình Vận Thế
  const upperStatus = {
    term: 'Thượng Đình (Thiên Đình - Trán)',
    ageRange: '15 - 30 Tuổi',
    rating: upperRatio >= 0.32 ? 'Cát Tường • Tiên Thiên Phú Bẩm' : 'Bình Hòa • Cần Tôi Luyện',
    insight: upperRatio >= 0.32
      ? 'Trán cao sáng, khí sắc khai hoa, sớm phát huy tư duy và học thức uyên bác.'
      : 'Thời niên thiếu tự lập, tự mình tích lũy kinh nghiệm, không ỷ lại gia đình.',
    classicalRule: '《Ma Y Thần Tướng》: "Thiên đình cao quảng, thiếu niên hiển đạt; trán nở chân mày thanh, quý khí tự lai."'
  };

  const middleStatus = {
    term: 'Trung Đình (Nhân Đình - Mũi & Quyền)',
    ageRange: '31 - 50 Tuổi',
    rating: middleRatio >= 0.31 ? 'Đại Cát • Trung Niên Tự Lập' : 'Vững Vàng • Tích Lũy Bền Bỉ',
    insight: middleRatio >= 0.31
      ? 'Sống mũi thẳng thắn, quyền mũi triều củng, trung niên mở mang cơ nghiệp rực rỡ.'
      : 'Cần giữ gìn tính thận trọng trong quản trị tài chính và hợp tác làm ăn.',
    classicalRule: '《Thần Tướng Toàn Biên》: "Nhân đình vi bản, tỵ trực quyền phối, trung niên đại phát, tự thủ giang sơn."'
  };

  const lowerStatus = {
    term: 'Hạ Đình (Địa Các - Cằm & Miệng)',
    ageRange: '51 Tuổi Trở Về Hậu Vận',
    rating: lowerRatio >= 0.32 ? 'Thanh Nhàn • Hậu Vận Phú Túc' : 'Ấn Định • An Vui Tuổi Già',
    insight: lowerRatio >= 0.32
      ? 'Địa các vuông tròn dày dặn, con cháu hiếu thuận, điền trạch vững bền hưởng phúc thọ.'
      : 'Hậu vận thanh nhàn êm ấm, chú trọng dưỡng tâm an lạc và truyền thụ kinh nghiệm cho hậu bối.',
    classicalRule: '《Liễu Trang Thần Tướng》: "Địa các triều thiên, nhân trung thâm trường, vãn cảnh đại phú, tôn tức phồn vinh."'
  };

  const variance = Math.abs(upperRatio - 0.33) + Math.abs(middleRatio - 0.33) + Math.abs(lowerRatio - 0.33);
  const harmonyScore = Math.max(75, Math.min(98, Math.round(100 - variance * 80)));
  const harmonyVerdict = harmonyScore >= 88
    ? 'Tam Đình Cân Đẳng Tương Xứng – Tướng Cách Quý Khí Hiếm Có'
    : 'Tam Đình Tương Hợp Nhu Nhuận – Cuộc Đời Hanh Thông Vững Tiến';

  return {
    timestamp: new Date().toISOString(),
    faceMetrics: {
      aspectRatio,
      upperRatio,
      middleRatio,
      lowerRatio,
      brightnessAverage: Math.round(avgLum),
      skinWarmth
    },
    elementShape,
    hexagram,
    tamDinhVerdict: {
      upperStatus,
      middleStatus,
      lowerStatus,
      harmonyScore,
      harmonyVerdict
    },
    keyPalaces: TWELVE_PALACES_CATALOG,
    khiSacInterpretation: {
      title: `Khí Sắc Hiện Tại: ${skinWarmth}`,
      description: `Hình ảnh phân tích cho thấy sắc khí thiên về ${skinWarmth}. Theo sách cổ, đây là dấu hiệu của chân khí lưu thông thuận hòa, tinh thần minh mẫn, không vướng tử khí hay ám khí.`,
      forecastPeriod: 'Thời vận 6 đến 12 tháng tới hanh thông, thích hợp mở rộng dự định lớn.',
      sourceBook: '《Ma Y Thần Tướng – Khí Sắc Thiên》: "Sắc quý quang nhuận, khí quý thanh minh; khí sắc tề phát, vạn sự hanh thông."'
    },
    cultivationAdvice: {
      coreMotto: 'Hữu tâm vô tướng, tướng trục tâm sinh; Hữu tướng vô tâm, tướng tùy tâm diệt.',
      explanation: 'Cổ nhân coi tướng mạo chỉ là cái vỏ của khí huyết và tâm thần. Muốn tướng mạo ngày càng quý hiển, nhất thiết phải bắt đầu từ việc tu dưỡng tâm tính thiện lương.',
      threeActions: [
        'Nuôi dưỡng lòng bao dung: Mở rộng tâm lượng với người xung quanh sẽ làm thư giãn vùng Ấn Đường và Gian Môn, tự khắc hút quý nhân.',
        'Giữ lời nói chân thành: Khẩu đức đoan chính giúp cung Địa Các và khóe miệng luôn ngậm triều khí, tụ tài tích đức.',
        'Sống có mục tiêu và chánh niệm: Ánh mắt trong sáng định thần sẽ củng cố thần khí, xua tan mọi ám trệ trên diện mạo.'
      ]
    }
  };
}

// ----------------------------------------------------
// THUẬT TOÁN ĐO LƯỜNG VÀ PHÁT QUẺ VÂN TAY (10 NGÓN BÁT QUÁI)
// ----------------------------------------------------
export function generateFingerprintReport(
  fingerMap: Record<string, 'whorl' | 'loop' | 'arch'>
): FingerprintReadingReport {
  let whorlCount = 0;
  let loopCount = 0;
  let archCount = 0;

  const baguaFingers: FingerprintReadingReport['baguaFingers'] = [];

  const fingerKeys = [
    { key: 'L_thumb', name: 'Ngón Cái Trái', hand: 'Trái' as const, sign: 'Càn Kim - Năng lực lãnh đạo nội tại & Ý chí' },
    { key: 'L_index', name: 'Ngón Trỏ Trái', hand: 'Trái' as const, sign: 'Tốn Mộc - Khả năng tưởng tượng & Không gian' },
    { key: 'L_middle', name: 'Ngón Giữa Trái', hand: 'Trái' as const, sign: 'Khảm Thủy - Cảm thụ vận động & Nhịp điệu' },
    { key: 'L_ring', name: 'Ngón Áp Út Trái', hand: 'Trái' as const, sign: 'Ly Hỏa - Cảm thụ âm thanh & Ngôn ngữ nghệ thuật' },
    { key: 'L_pinky', name: 'Ngón Út Trái', hand: 'Trái' as const, sign: 'Cấn Thổ - Trực giác thẩm mỹ & Tri giác thị giác' },
    { key: 'R_thumb', name: 'Ngón Cái Phải', hand: 'Phải' as const, sign: 'Khôn Thổ - Năng lực quản trị & Tương tác xã hội' },
    { key: 'R_index', name: 'Ngón Trỏ Phải', hand: 'Phải' as const, sign: 'Chấn Mộc - Tư duy logic & Phân tích giải quyết vấn đề' },
    { key: 'R_middle', name: 'Ngón Giữa Phải', hand: 'Phải' as const, sign: 'Khảm Thủy - Năng lực vận động tinh & Thao tác khéo léo' },
    { key: 'R_ring', name: 'Ngón Áp Út Phải', hand: 'Phải' as const, sign: 'Đoài Kim - Năng lực tiếp nhận ngôn ngữ & Phân tích âm' },
    { key: 'R_pinky', name: 'Ngón Út Phải', hand: 'Phải' as const, sign: 'Cấn Thổ - Năng lực quan sát chi tiết & Đọc bản đồ' }
  ];

  fingerKeys.forEach(f => {
    const pat = fingerMap[f.key] || 'whorl';
    if (pat === 'whorl') whorlCount++;
    else if (pat === 'loop') loopCount++;
    else archCount++;

    baguaFingers.push({
      fingerName: f.name,
      hand: f.hand,
      pattern: pat,
      baguaSignificance: f.sign,
      classicDomain: pat === 'whorl' ? 'Đại Bàng (Hoa Tay) • Chủ động' : pat === 'loop' ? 'Nước Chảy • Hòa nhập' : 'Núi Thái Sơn • Kiên cố'
    });
  });

  const poemData = WHORL_POEMS_CATALOG[whorlCount] || WHORL_POEMS_CATALOG[5];

  // Khởi quẻ Bát Quái từ tỷ lệ vân tay
  let hexagramName = 'Địa Thiên Thái';
  let hexagramSymbol = '䷊';
  let hexagramOverview = 'Âm dương điều hòa, thông tuệ tự thân, vạn sự hanh thông thuận lợi.';

  if (whorlCount >= 7) {
    hexagramName = 'Thuần Càn (Cương Kiện Tự Cường)';
    hexagramSymbol = '䷀';
    hexagramOverview = 'Khí dương cực thịnh, ý chí sắt đá, thiên hướng khai phá dẫn đầu.';
  } else if (loopCount >= 7) {
    hexagramName = 'Thuần Khôn (Hậu Đức Tải Vật)';
    hexagramSymbol = '䷁';
    hexagramOverview = 'Tính khí nhu hòa như nước, khéo léo giao tế, tùy cơ ứng biến đại phú.';
  } else if (archCount >= 3) {
    hexagramName = 'Thuần Cấn (An Chỉ Như Sơn)';
    hexagramSymbol = '䷳';
    hexagramOverview = 'Vững vàng như núi, chuyên môn uyên sâu, hậu tích bạc phát chắc chắn.';
  } else if (whorlCount >= 4 && loopCount >= 4) {
    hexagramName = 'Thủy Hỏa Ký Tế (Viên Mãn Quân Bình)';
    hexagramSymbol = '䷾';
    hexagramOverview = 'Lửa dưới nước trên, vừa quyết đoán vừa nhu thuận, phong thái lãnh đạo hoàn hảo.';
  }

  return {
    whorlCount,
    loopCount,
    archCount,
    classicalPoem: {
      rhymeTitle: poemData.title,
      poemLines: poemData.lines,
      ancientMeaning: poemData.ancientMeaning
    },
    hexagramDivination: {
      name: hexagramName,
      symbol: hexagramSymbol,
      overview: hexagramOverview
    },
    temperamentProfile: {
      title: whorlCount >= 5 ? 'Thiên Hướng: Lãnh Đạo & Quyết Đoán Tự Thân' : loopCount >= 5 ? 'Thiên Hướng: Nhu Thuận, Thấu Cảm & Kết Nối' : 'Thiên Hướng: Quân Bình Đa Diện',
      strengths: [
        `Sở hữu ${whorlCount} hoa tay: Khả năng tập trung và độc lập tác chiến cao`,
        `Sở hữu ${loopCount} vân nước: Năng lực thích ứng và giao lưu linh hoạt`,
        `Sở hữu ${archCount} vân núi: Tính thận trọng và kiểm soát rủi ro tuyệt vời`
      ],
      developmentFocus: [
        'Duy trì sự kiên nhẫn khi lắng nghe ý kiến đóng góp từ tập thể',
        'Phát huy thế mạnh của ngón tay chỉ huy để dẫn dắt công việc chiến lược'
      ],
      careerDirection: whorlCount >= 6
        ? ['Chủ doanh nghiệp', 'Giám đốc chiến lược', 'Luật sư tranh tụng', 'Chuyên gia độc lập']
        : ['Quản trị nhân sự', 'Giáo dục truyền thông', 'Dịch vụ tư vấn cao cấp', 'Ngoại giao']
    },
    baguaFingers,
    cultivationRule: '《Bát Quái Thủ Tướng Toàn Thư》 viết: "Vân do cốt phát, khí do tâm lưu. Hoa tay dù ít hay nhiều, cốt ở tâm đức kiên định thì tiền tài tự tụ, phúc ấm tự dày."'
  };
}

