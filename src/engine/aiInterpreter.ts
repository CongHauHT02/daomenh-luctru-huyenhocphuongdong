/**
 * ĐẠO MỆNH – BỘ MÁY KẾT NỐI LUẬN LÝ CỔ THƯ & XUẤT BÁO CÁO (CLASSICAL REPORT ENGINE)
 * Tuân thủ tuyệt đối Mục XV: Hệ thống luận lý thuần cổ thư, KHÔNG để AI quyết định kết quả.
 * Mỗi nhận định bắt buộc đi kèm Hồ Sơ Dẫn Chứng chi tiết (A -> H) với số trang in và số trang PDF.
 */

import { BaziChart } from './bazi';
import {
  ClassicalEvidenceProfile,
  StructuredInterpretationItem,
  buildVerifiedInterpretationItem
} from './classicalEvidence';

export interface VerifiedReport {
  chartTitle: string;
  calculatedSummary: string;
  items: StructuredInterpretationItem[];
  ethicalDisclaimer: string;
  systemAuditStamp: {
    engineVersion: string;
    rulesVersion: string;
    calculatedAt: string;
    aiInterference: 'HOÀN TOÀN KHÔNG (0% AI INTERFERENCE)';
  };
}

export function generateBaziInterpretation(chart: BaziChart): VerifiedReport {
  const dm = chart.dayMaster;
  const pillars = chart.pillars;
  const gods = chart.gods;

  const items: StructuredInterpretationItem[] = [];

  // 1. Nhận định về Vượng Suy & Dụng Thần (Có chứng cứ từ Tử Bình Chân Thuyên)
  const strengthDataMatched = `Nhật Can ${dm.can} (${dm.element} ${dm.yinYang}) sinh vào Chi Tháng ${pillars.month.canChi.chi}. Nội lực Nhật Chủ đạt ${dm.score}/100 điểm (${dm.strength}).`;
  const strengthConclusion = `Nhật Chủ ${dm.can} thuộc trạng thái ${dm.strength}. Căn cứ nguyên lý cân bằng cổ thư, Dụng Thần được xác lập là ${gods.dungThan}, Hỷ Thần là ${gods.hyThan}, Kỵ Thần là ${gods.kyThan}.`;
  items.push(
    buildVerifiedInterpretationItem(
      'Khí Thế Vượng Suy & Phù Ức Dụng Thần',
      'RULE-BZ-002',
      strengthConclusion,
      strengthDataMatched
    )
  );

  // 2. Nhận định về Điệu Hầu Mùa Sinh (Có chứng cứ từ Cùng Thông Bảo Giám)
  const seasonDataMatched = `Sinh vào tiết khí ${chart.profile.solarTerm.name}, Lệnh Tháng tọa chi ${pillars.month.canChi.chi}.`;
  const seasonConclusion = `Lá số sinh vào thời điểm giao khí ${chart.profile.solarTerm.name}. Cần lưu tâm khí hậu mùa sinh để điều hòa ấm áp hoặc nhuận trạch chân khí toàn cục.`;
  items.push(
    buildVerifiedInterpretationItem(
      'Thời Lệnh Tiết Khí & Cân Bằng Điệu Hầu',
      'RULE-BZ-001',
      seasonConclusion,
      seasonDataMatched
    )
  );

  // 3. Nhận định về Năng Lực & Trụ Thời Khắc (Có chứng cứ từ Tử Bình Chân Thuyên)
  const careerDataMatched = `Trụ Ngày ${pillars.day.canChi.fullName}, Thập thần trụ là ${pillars.day.tenGodStem}. Thân ${dm.strength}.`;
  items.push(
    buildVerifiedInterpretationItem(
      'Định Hướng Năng Lực & Cốt Cách Ngũ Hành',
      'RULE-BZ-002',
      `Nhật Chủ lấy Dụng Thần ${gods.dungThan} làm kim chỉ nam phát triển năng lực, nên trau dồi các lĩnh vực thực tế bổ trợ cho ngũ hành này nhằm đạt trạng thái cân bằng nguyên khí.`,
      careerDataMatched
    )
  );

  // 4. Nhận định về Tiên Thiên Thụ Khí & Thai Nguyên (Có chứng cứ từ Tam Mệnh Thông Hội)
  const thaiDataMatched = `Chi Tháng ${pillars.month.canChi.chi}, Can Tháng ${pillars.month.canChi.can}. Thụ khí tại thời điểm hoài thai.`;
  items.push(
    buildVerifiedInterpretationItem(
      'Khí Chất Tiên Thiên & Trụ Thai Nguyên',
      'RULE-LZ-001',
      `Khí tiên thiên thụ nhận từ tháng hoài thai hình thành gốc rễ thể chất và tính cách bẩm sinh. Trụ Thai Nguyên phối hợp cùng bản mệnh tạo nền tảng vững vàng cho sinh lực.`,
      thaiDataMatched
    )
  );

  // 5. Cung Hôn Phối & Tình Duyên (Trường hợp chưa đủ bản in đã xác minh số trang)
  items.push(
    buildVerifiedInterpretationItem(
      'Cung Hôn Phối & Chi Tiết Phu Thê',
      'RULE-UNVERIFIED-MARRIAGE',
      '',
      'Chi Ngày (Phu Thê Cung)'
    )
  );

  // 6. Dự Báo Biến Cố Vận Hạn Tương Lai Cụ Thể (Trường hợp cấm AI suy diễn ngoài cổ thư)
  items.push(
    buildVerifiedInterpretationItem(
      'Dự Báo Biến Cố Họa Phúc Tương Lai Cụ Thể',
      'RULE-UNVERIFIED-EVENTS',
      '',
      'Đại Vận & Lưu Niên'
    )
  );

  return {
    chartTitle: `Hồ Sơ Luận Mệnh Cổ Thư – ${chart.profile.fullName} (${pillars.year.canChi.fullName})`,
    calculatedSummary: `Lá số xác lập tại tiết khí ${chart.profile.solarTerm.name}. Tứ trụ: Trụ Năm (${pillars.year.canChi.fullName}), Trụ Tháng (${pillars.month.canChi.fullName}), Trụ Ngày (${pillars.day.canChi.fullName}), Trụ Giờ (${pillars.hour.canChi.fullName}). Nhật Chủ ${dm.can} (${dm.element}) đạt ${dm.strength} (${dm.score}/100 điểm).`,
    items,
    ethicalDisclaimer: 'Báo cáo được khởi tạo hoàn toàn từ Bộ Quy Tắc Cổ Thư đã xác minh (Classical Rule Engine). Không có bất kỳ kết luận nào do AI tự suy đoán. Các nhận định chỉ phản ánh tri thức văn hóa truyền thống phương Đông, không thay thế cho các quyết định y tế, pháp lý, tài chính hoặc ý chí tự do của cá nhân.',
    systemAuditStamp: {
      engineVersion: 'Classical-Astro-v4.2.0',
      rulesVersion: 'Tử-Bình-Khâm-Định-v2.4.1',
      calculatedAt: new Date().toLocaleString('vi-VN'),
      aiInterference: 'HOÀN TOÀN KHÔNG (0% AI INTERFERENCE)'
    }
  };
}
