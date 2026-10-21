/**
 * ĐẠO MỆNH – THƯ VIỆN CỔ THƯ & TRI THỨC HUYỀN HỌC (CLASSICAL KNOWLEDGE BASE)
 * Dữ liệu có cấu trúc từ các tác phẩm kinh điển:
 * 《Uyên Hải Tử Bình》, 《Tam Mệnh Thông Hội》, 《Đích Thiên Tủy》, 《Cùng Thông Bảo Giám》,
 * 《Tử Bình Chân Thuyên》, 《Thần Phong Thông Khảo》, 《Tử Vi Đẩu Số Toàn Thư》, 《Ma Y Thần Tướng》
 */

export interface TreatiseChapter {
  id: string;
  chapterIndex: number;
  chapterTitle: string;
  originalTextZh: string;
  translationVi: string;
  concepts: string[];
  applicableSchool: string;
  explanation: string;
}

export interface ClassicalTreatise {
  id: string;
  code: string;
  titleVi: string;
  titleZh: string;
  author: string;
  dynasty: string;
  category: 'bazi' | 'liuzhu' | 'tuvi' | 'physiognomy' | 'fengshui' | 'calendar';
  categoryLabel: string;
  reliability: 'Rất Cao (Kinh Điển Cốt Lõi)' | 'Cao (Sách Tham Khảo Quan Trọng)' | 'Tân Phái Nghiên Cứu';
  description: string;
  chapters: TreatiseChapter[];
}

export const CLASSICAL_TREATISES: ClassicalTreatise[] = [
  {
    id: 'uyen-hai-tu-binh',
    code: 'uyen_hai_tu_binh',
    titleVi: 'Uyên Hải Tử Bình',
    titleZh: '淵海子平',
    author: 'Từ Tử Bình (Nguyên tác) / Từ Đại Thăng (Biên soạn)',
    dynasty: 'Thời Tống (Thế kỷ 10 - 13)',
    category: 'bazi',
    categoryLabel: 'Bát Tự Tứ Trụ',
    reliability: 'Rất Cao (Kinh Điển Cốt Lõi)',
    description: 'Tác phẩm nền móng đặt viên gạch đầu tiên cho môn Bát Tự Tứ Trụ Tử Bình, chuyển trọng tâm xem mệnh từ Niên Mệnh (Nạp Âm) sang lấy Nhật Can làm trung tâm (Nhật Chủ).',
    chapters: [
      {
        id: 'uhtb-c1',
        chapterIndex: 1,
        chapterTitle: 'Luận Thiên Can Địa Chi Khí Tượng',
        originalTextZh: '天地覆載，萬物化生。干支相配，以紀年月。甲乙東方木，丙丁南方火，戊己中央土，庚辛西方金，壬癸北方水。',
        translationVi: 'Trời đất che chở, muôn vật biến hóa sinh sôi. Can chi phối hợp để ghi lại năm, tháng, ngày, giờ. Giáp Ất là Mộc phương Đông, Bính Đinh là Hỏa phương Nam, Mậu Kỷ là Thổ trung ương, Canh Tân là Kim phương Tây, Nhâm Quý là Thủy phương Bắc.',
        concepts: ['Thiên Can', 'Địa Chi', 'Ngũ Hành Phân Phương'],
        applicableSchool: 'Tử Bình Truyền Thống',
        explanation: 'Khẳng định vị trí và tính chất của 10 Thiên Can phối với 5 phương vị và ngũ hành gốc.'
      },
      {
        id: 'uhtb-c2',
        chapterIndex: 2,
        chapterTitle: 'Kế Thiện Thiên – Luận Thập Thần Cách Cục',
        originalTextZh: '人稟天地，命屬五行。先觀月令以推其輕重，次看日時以定其吉凶。',
        translationVi: 'Người thụ bẩm khí trời đất, mệnh thuộc về năm hành ngũ hành. Trước tiên phải quan sát Nguyệt Lệnh (Chi tháng) để suy xét khí chất khinh trọng vượng suy, sau đó mới xét đến Trụ Ngày và Trụ Giờ để định định cát hung.',
        concepts: ['Nguyệt Lệnh', 'Nhật Chủ', 'Vượng Suy'],
        applicableSchool: 'Tử Bình Uyên Hải',
        explanation: 'Khẩu quyết mấu chốt: Lệnh tháng nắm quyền sinh sát tối cao trong Bát Tự, là gốc rễ của mọi suy đoán.'
      }
    ]
  },
  {
    id: 'dich-thien-tuy',
    code: 'dich_thien_tuy',
    titleVi: 'Đích Thiên Tủy',
    titleZh: '滴天髓',
    author: 'Kinh Đồ (Tương truyền) / Lưu Bá Ôn (Chú giải) / Nhậm Thiết Tiều (Trần chú)',
    dynasty: 'Thời Minh - Thanh',
    category: 'bazi',
    categoryLabel: 'Bát Tự Triết Học',
    reliability: 'Rất Cao (Kinh Điển Cốt Lõi)',
    description: 'Cuốn sách mệnh lý sâu sắc nhất mang tầm triết học uyên áo, không chú trọng thần sát vụn vặt mà đi thẳng vào khí thế ngũ hành chân chính.',
    chapters: [
      {
        id: 'dtt-c1',
        chapterIndex: 1,
        chapterTitle: 'Thông Thần Luận – Thiên Đạo Khí Tượng',
        originalTextZh: '欲識三元萬法宗，先觀帝載與神功。坤元合德機箴深，五氣偏全定吉凶。',
        translationVi: 'Muốn hiểu thấu cội nguồn của muôn phép trong Tam Nguyên, trước hết phải chiêm nghiệm sự vận hành của càn khôn và diệu dụng của tạo hóa. Khí đất phối hợp với đức trời sâu xa huyền diệu, ngũ khí thiên lệch hay chu toàn chính là thước đo quyết định cát hung.',
        concepts: ['Thông Thần', 'Ngũ Khí', 'Cân Bằng'],
        applicableSchool: 'Đích Thiên Tủy Khí Tượng Phái',
        explanation: 'Tử Bình không phải là bói toán định mệnh, mà là nghiên cứu sự điều hòa khí cơ ngũ hành giữa con người và vũ trụ.'
      },
      {
        id: 'dtt-c2',
        chapterIndex: 2,
        chapterTitle: 'Luận Giáp Mộc – Tính Tình & Sinh Khắc',
        originalTextZh: '甲木參天，脫胎要火。春不容金，秋不容土。火熾乘龍，水宕騎虎。地潤天和，植立千古。',
        translationVi: 'Giáp Mộc là cây cao vút chọc trời, muốn thoát thai rực rỡ cần có Hỏa làm ấm. Mùa xuân cây non không chịu nổi Kim đẽo gọt, mùa thu lá vàng chẳng kham nổi Thổ khô dày. Hỏa quá rực cháy cần cưỡi rồng (Thìn Thổ), Thủy quá mênh mông cần cưỡi hổ (Dần Mộc). Đất đai nhuần nhị, trời đất giao hòa thì Giáp Mộc đứng vững ngàn năm.',
        concepts: ['Giáp Mộc', 'Điệu Hầu', 'Hình Tượng Mệnh'],
        applicableSchool: 'Đích Thiên Tủy Can Tượng',
        explanation: 'Phương pháp hình tượng hóa ngũ hành sống động của Đích Thiên Tủy, hướng dẫn cách gia giảm cứu ứng.'
      }
    ]
  },
  {
    id: 'tam-menh-thong-hoi',
    code: 'tam_menh_thong_hoi',
    titleVi: 'Tam Mệnh Thông Hội',
    titleZh: '三命通會',
    author: 'Vạn Dân Anh (Tiến sĩ thời Minh Gia Tĩnh)',
    dynasty: 'Thời Minh (Năm 1578)',
    category: 'liuzhu',
    categoryLabel: 'Lục Trụ & Đại Bách Khoa Mệnh Lý',
    reliability: 'Rất Cao (Kinh Điển Cốt Lõi)',
    description: 'Bộ đại bách khoa toàn thư đồ sộ bậc nhất gồm 12 quyển, được đưa vào Khâm Định Tứ Khố Toàn Thư thời Càn Long. Tác phẩm bảo lưu đầy đủ nhất thuyết Thai Nguyên và Mệnh Cung (tiền thân của Lục Trụ).',
    chapters: [
      {
        id: 'tmth-c1',
        chapterIndex: 1,
        chapterTitle: 'Quyển 3 – Luận Thai Nguyên & Thụ Khí',
        originalTextZh: '夫胎者，受形之始；月者，秉氣之因。故月干進一位，月支進三位，為之胎元。',
        translationVi: 'Thai là điểm khởi đầu của hình hài thể chất; Nguyệt (Tháng) là nguyên nhân thụ nhận thiên địa chi khí. Cho nên Can tháng tiến 1 ngôi, Chi tháng tiến 3 ngôi, gọi đó là Thai Nguyên.',
        concepts: ['Thai Nguyên', 'Tiên Thiên', 'Lục Trụ'],
        applicableSchool: 'Trường Phái Thai Mệnh Cổ Điển',
        explanation: 'Chứng cứ cổ thư chính thống xác lập công thức tính Trụ Thai Nguyên: Nguyệt Can + 1, Nguyệt Chi + 3.'
      },
      {
        id: 'tmth-c2',
        chapterIndex: 2,
        chapterTitle: 'Quyển 3 – Luận Mệnh Cung Thần Sát',
        originalTextZh: '神無廟無所歸，人無室無所本。命宮者，乃人命之歸宿，不可不察。',
        translationVi: 'Thần không có đền miếu thì không nơi nương tựa, người không có nhà cửa thì chẳng có gốc rễ. Mệnh Cung chính là nơi quy túc gửi gắm của sinh mệnh một con người, bậc học giả không thể không xem xét kỹ lưỡng.',
        concepts: ['Mệnh Cung', 'Quy Túc', 'Lục Trụ'],
        applicableSchool: 'Trường Phái Mệnh Cung',
        explanation: 'Vai trò của Mệnh Cung như trụ thứ 6 bảo trợ cho Bát Tự Tứ Trụ.'
      }
    ]
  },
  {
    id: 'cung-thong-bao-giam',
    code: 'cung_thong_bao_giam',
    titleVi: 'Cùng Thông Bảo Giám (Lan Đài Diệu Tuyển)',
    titleZh: '窮通寶鑑',
    author: 'Khuyết danh (Thời Minh) / Dư Xuân Đài biên tập / Từ Lạc Ngô chú giải',
    dynasty: 'Thời Minh - Thanh',
    category: 'bazi',
    categoryLabel: 'Bát Tự Điệu Hầu',
    reliability: 'Rất Cao (Kinh Điển Cốt Lõi)',
    description: 'Chuyên luận sâu sắc nhất về phương pháp Điệu Hầu (Cân bằng nhiệt độ và mùa sinh). Lấy 10 Thiên Can sinh trong 12 tháng làm kim chỉ nam.',
    chapters: [
      {
        id: 'ctbg-c1',
        chapterIndex: 1,
        chapterTitle: 'Luận Thập Can Phối Mười Hai Tháng Chi Khí',
        originalTextZh: '正月甲木，初春尚有餘寒，得丙火照暖，則富貴无疑。',
        translationVi: 'Tháng Giêng Giáp Mộc, đầu xuân vẫn còn hàn khí sót lại từ mùa đông, nếu trong trụ có được Bính Hỏa sưởi ấm thì công danh phú quý là điều không thể nghi ngờ.',
        concepts: ['Điệu Hầu', 'Bính Hỏa', 'Mùa Sinh'],
        applicableSchool: 'Điệu Hầu Phái',
        explanation: 'Nhấn mạnh tính quy luật tự nhiên: vạn vật sinh trưởng cần ánh sáng mặt trời ấm áp khi vừa qua khỏi tiết đông hàn.'
      }
    ]
  },
  {
    id: 'tu-vi-dau-so-toan-thu',
    code: 'tu_vi_dau_so_toan_thu',
    titleVi: 'Tử Vi Đẩu Số Toàn Thư',
    titleZh: '紫微斗數全書',
    author: 'Hy Di Trần Đoàn (Tương truyền) / Phan Tử Khiêm (Hiệu chính)',
    dynasty: 'Thời Tống - Minh',
    category: 'tuvi',
    categoryLabel: 'Tử Vi Đẩu Số',
    reliability: 'Rất Cao (Kinh Điển Cốt Lõi)',
    description: 'Tác phẩm gốc kinh điển về Tử Vi Đẩu Số, quy định chi tiết quy tắc an 14 chính tinh, phụ tinh, an mệnh thân và 12 cung chức vị thế sự.',
    chapters: [
      {
        id: 'tvdstt-c1',
        chapterIndex: 1,
        chapterTitle: 'Thái Vi Phú – Tinh Yếu Tử Vi',
        originalTextZh: '希夷仰觀天文，俯察地理，因以星辰吉凶，定人命之休咎。祿逢衝破，吉處藏凶；馬遇空亡，終身奔走。',
        translationVi: 'Hy Di tiên sinh ngửa mặt xem thiên văn, cúi đầu xét địa lý, mượn tinh tú cát hung để định ra bước thịnh suy của đời người. Lộc gặp xung phá thì nơi tốt lành lại ẩn chứa tai họa; Thiên Mã ngộ Triệt Không thì suốt đời vất vả tha hương.',
        concepts: ['Thái Vi Phú', 'Lộc Tồn', 'Thiên Mã'],
        applicableSchool: 'Nam Phái Tử Vi',
        explanation: 'Quy tắc tương tác giữa các cát tinh và sát tinh trong Tử Vi Đẩu Số.'
      }
    ]
  },
  {
    id: 'ma-y-than-tuong',
    code: 'ma-y-than-tuong',
    titleVi: 'Ma Y Thần Tướng',
    titleZh: '麻衣神相',
    author: 'Ma Y Đạo Giả (Sư phụ của Trần Đoàn)',
    dynasty: 'Thời Ngũ Đại - Bắc Tống',
    category: 'physiognomy',
    categoryLabel: 'Nhân Tướng Học',
    reliability: 'Cao (Sách Tham Khảo Quan Trọng)',
    description: 'Bộ cổ thư kinh điển nhất về thuật xem tướng mặt, khai sinh ra thuyết Tam Đình, Ngũ Nhạc và 12 Cung tướng diện.',
    chapters: [
      {
        id: 'mytx-c1',
        chapterIndex: 1,
        chapterTitle: 'Tam Đình Ngũ Nhạc Tổng Luận',
        originalTextZh: '天庭高聳，少年富貴；地閣方圓，晚歲榮華。額為上停，鼻為中停，頤為下停。三停平等，一生衣食無憂。',
        translationVi: 'Trán cao vút sáng sủa thì thời niên thiếu sớm thành danh; Cằm vuông tròn đầy đặn thì tuổi già an hưởng vinh hoa. Trán là Thượng đình, Mũi là Trung đình, Cằm là Hạ đình. Ba đình cân đối hài hòa thì một đời cơm áo đủ đầy, tâm tính an nhiên.',
        concepts: ['Tam Đình', 'Thượng Đình', 'Địa Các'],
        applicableSchool: 'Ma Y Tướng Pháp',
        explanation: 'Nguyên lý tam đình cân đối biểu thị sự hài hòa giữa Thiên - Địa - Nhân.'
      }
    ]
  }
];

/**
 * Tìm kiếm thư viện cổ thư theo từ khóa, chuyên mục hoặc khái niệm
 */
export function searchKnowledgeBase(query: string, categoryFilter?: string): ClassicalTreatise[] {
  const normalizedQuery = query.toLowerCase().trim();

  return CLASSICAL_TREATISES.filter(treatise => {
    // Lọc theo chuyên mục nếu có
    if (categoryFilter && categoryFilter !== 'all' && treatise.category !== categoryFilter) {
      return false;
    }

    if (!normalizedQuery) return true;

    // Tìm trong tiêu đề, tác giả, mô tả
    const matchMeta =
      treatise.titleVi.toLowerCase().includes(normalizedQuery) ||
      treatise.titleZh.toLowerCase().includes(normalizedQuery) ||
      treatise.author.toLowerCase().includes(normalizedQuery) ||
      treatise.description.toLowerCase().includes(normalizedQuery);

    if (matchMeta) return true;

    // Tìm trong các chương mục và bản dịch
    const matchChapter = treatise.chapters.some(chap =>
      chap.chapterTitle.toLowerCase().includes(normalizedQuery) ||
      chap.translationVi.toLowerCase().includes(normalizedQuery) ||
      chap.originalTextZh.includes(normalizedQuery) ||
      chap.concepts.some(c => c.toLowerCase().includes(normalizedQuery))
    );

    return matchChapter;
  });
}
