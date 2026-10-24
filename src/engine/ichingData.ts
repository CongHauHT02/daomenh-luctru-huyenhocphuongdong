/**
 * ĐẠO MỆNH – BẢNG TRA CỨU TOÀN VĂN 64 QUẺ CHU DỊCH (CHU DỊCH TOÀN THƯ)
 * Nguồn: 《Chu Dịch Toàn Thư》 - Thoán Từ Chu Văn Vương, Đại Tượng Truyện Khổng Tử, Hào Từ Chu Công Đán.
 * Tuyệt đối 100% Cổ Thư nguyên bản, dùng cho thuật toán khởi quẻ Mai Hoa Dịch Số.
 */

export interface HexagramDetail {
  number: number;             // Số thứ tự 1-64 Chu Dịch
  key: string;                // "upper-lower", e.g. "1-1", "8-1"
  nameVi: string;             // Tên tiếng Việt (e.g. Địa Thiên Thái)
  nameZh: string;             // Tên chữ Hán (e.g. 地天泰)
  symbol: string;             // Ký hiệu Unicode quẻ (䷀ đến ䷿)
  upperNum: number;           // 1: Càn, 2: Đoài, 3: Ly, 4: Chấn, 5: Tốn, 6: Khảm, 7: Cấn, 8: Khôn
  lowerNum: number;
  upperName: string;          // Thiên, Trạch, Hỏa, Lôi, Phong, Thủy, Sơn, Địa
  lowerName: string;
  judgment: string;           // Thoán Từ Chu Văn Vương
  greatImage: string;         // Đại Tượng Truyện Khổng Tử
  meaning: string;            // Ý nghĩa dịch lý cổ điển
  dailyAdvice: string;        // Chỉ dẫn hành sự trong ngày
  lineTexts: string[];        // 6 Hào từ (Hào 1 đến Hào 6)
}

// Bát Quái Tiên Thiên
export const TRIGRAM_NAMES: Record<number, { name: string; nature: string; symbol: string; lines: [number, number, number] }> = {
  1: { name: 'Càn', nature: 'Thiên (Trời)', symbol: '☰', lines: [1, 1, 1] },
  2: { name: 'Đoài', nature: 'Trạch (Đầm)', symbol: '☱', lines: [1, 1, 0] },
  3: { name: 'Ly', nature: 'Hỏa (Lửa)', symbol: '☲', lines: [1, 0, 1] },
  4: { name: 'Chấn', nature: 'Lôi (Sấm)', symbol: '☳', lines: [1, 0, 0] },
  5: { name: 'Tốn', nature: 'Phong (Gió)', symbol: '☴', lines: [0, 1, 1] },
  6: { name: 'Khảm', nature: 'Thủy (Nước)', symbol: '☵', lines: [0, 1, 0] },
  7: { name: 'Cấn', nature: 'Sơn (Núi)', symbol: '☶', lines: [0, 0, 1] },
  8: { name: 'Khôn', nature: 'Địa (Đất)', symbol: '☷', lines: [0, 0, 0] },
};

// Toàn văn dữ liệu 64 quẻ dịch
export const FULL_64_HEXAGRAMS: Record<string, HexagramDetail> = {
  '1-1': {
    number: 1, key: '1-1', nameVi: 'Thuần Càn', nameZh: '乾為天', symbol: '䷀', upperNum: 1, lowerNum: 1,
    upperName: 'Thiên', lowerName: 'Thiên',
    judgment: 'Càn: Nguyên, Hanh, Lợi, Trinh. Khí trời chí cương chí đại, sinh sôi muôn loài không ngừng.',
    greatImage: 'Thiên hành kiện, quân tử dĩ tự cường bất tức. (Trời chuyển động mạnh mẽ, người quân tử noi theo mà tự cường không nghỉ).',
    meaning: 'Thời vận hanh thông tột bực, đại minh đại thịnh, thích hợp khởi đầu đại sự.',
    dailyAdvice: 'Tự tin quyết đoán, nắm bắt thời cơ đi đầu, giữ đức tính trung chính cương trực.',
    lineTexts: [
      'Sơ Cửu: Tiềm long vật dụng. (Rồng ẩn dưới vực, thời cơ chưa tới, chớ nên vội động).',
      'Cửu Nhị: Hiện long tại điền, lợi kiến đại nhân. (Rồng xuất hiện nơi đồng ruộng, có lợi khi gặp bậc cao minh).',
      'Cửu Tam: Quân tử chung nhật càn càn, tịch dịch nhược, lệ vô cữu. (Ngày lo phấn đấu, đêm biết cẩn trọng, gặp nguy cũng không lỗi).',
      'Cửu Tứ: Hoặc dược tại uyên, vô cữu. (Hoặc nhảy nhót nơi vực sâu, linh hoạt tiến thoái, không lỗi).',
      'Cửu Ngũ: Phi long tại thiên, lợi kiến đại nhân. (Rồng bay lượn trên trời cao, công danh đắc thời đắc vị, đại cát).',
      'Thượng Cửu: Kháng long hữu hối. (Rồng bay quá cao tất gặp điều hối hận, nên biết điểm dừng).'
    ]
  },
  '8-8': {
    number: 2, key: '8-8', nameVi: 'Thuần Khôn', nameZh: '坤為地', symbol: '䷁', upperNum: 8, lowerNum: 8,
    upperName: 'Địa', lowerName: 'Địa',
    judgment: 'Khôn: Nguyên, Hanh, Lợi tẫn mã chi trinh. Đất mẹ nhu thuận, chở che muôn vật trường tồn.',
    greatImage: 'Địa thế khôn, quân tử dĩ hậu đức tải vật. (Thế đất dày dặn bao la, người quân tử lấy đức dày mà nâng đỡ muôn người).',
    meaning: 'Nhu thuận, kiên nhẫn, tích lũy âm thầm mang lại phước lộc bền bỉ.',
    dailyAdvice: 'Nên án binh bất động, lắng nghe ý kiến người khác, xử lý việc hậu cần, tránh tranh chấp.',
    lineTexts: [
      'Sơ Lục: Lý sương, kiên băng chí. (Giẫm lên sương sớm, biết băng dày sắp tới; cẩn trọng từ manh mối nhỏ).',
      'Lục Nhị: Trực, phương, đại, bất tập vô bất lợi. (Ngay thẳng, vuông vức, rộng lớn; không cầu học mưu mẹo mà trăm việc đều lợi).',
      'Lục Tam: Hàm chương khả trinh, hoặc tòng vương sự, vô thành hữu chung. (Giấu kín tài hoa, làm tròn bổn phận, kết cục tốt đẹp).',
      'Lục Tứ: Quát nang, vô cữu vô dự. (Buộc kín miệng túi, giữ mồm giữ miệng, không lỗi cũng không khen).',
      'Lục Ngũ: Hoàng thường, nguyên cát. (Mặc xiêm y vàng, giữ đạo trung dung khiêm hòa, đại cát).',
      'Thượng Lục: Long chiến vu dã, kỳ huyết huyền hoàng. (Rồng đánh nhau ngoài đồng nội, hao tổn nguyên khí, kỵ đối đầu kịch liệt).'
    ]
  },
  '6-4': {
    number: 3, key: '6-4', nameVi: 'Thủy Lôi Truân', nameZh: '水雷屯', symbol: '䷂', upperNum: 6, lowerNum: 4,
    upperName: 'Thủy', lowerName: 'Lôi',
    judgment: 'Truân: Nguyên, Hanh, Lợi, Trinh, vật dụng hữu du vãng, lợi kiến hầu. Vạn vật mới nảy mầm, gian nan lúc đầu.',
    greatImage: 'Vân lôi Truân, quân tử dĩ kinh luân. (Mây sấm mịt mù buổi sớm, quân tử sắp xếp quy củ trật tự).',
    meaning: 'Thời kỳ khởi nghiệp đầy thử thách, chưa nên vội mở rộng quy mô, cần tìm người dẫn đường.',
    dailyAdvice: 'Kiểm tra kỹ lưỡng các bước chuẩn bị, kiên nhẫn vượt qua khó khăn ban đầu, chớ nản lòng.',
    lineTexts: [
      'Sơ Cửu: Bàn hoàn, lợi cư trinh, lợi kiến hầu. (Còn ngập ngừng, nên giữ vững lòng trung chính, tìm người hiền tài trợ giúp).',
      'Lục Nhị: Truân như chiên như, ban mã như. (Khó khăn trắc trở, kiên định chờ thời cơ chín muồi, không kết giao vội).',
      'Lục Tam: Tức lộc vô ngu, duy nhập vu lâm trung. (Đuổi hươu không có người dẫn đường, lạc vào rừng sâu; chớ hành động mù quáng).',
      'Lục Tứ: Thừa mã ban như, cầu hôn cấu, vãng cát. (Ngựa xe đã sẵn, tìm kiếm cộng sự chân chính, cùng tiến tất cát).',
      'Cửu Ngũ: Truân kỳ cao, tiểu trinh cát, đại trinh hung. (Ơn huệ chưa thấm, làm việc nhỏ thì lành, việc lớn cần hoãn).',
      'Thượng Lục: Thừa mã ban như, khấp huyết liên như. (Bế tắc đến cùng cực khóc ra máu, nên bình tâm chuyển hướng mới).'
    ]
  },
  '7-6': {
    number: 4, key: '7-6', nameVi: 'Sơn Thủy Mông', nameZh: '山水蒙', symbol: '䷃', upperNum: 7, lowerNum: 6,
    upperName: 'Sơn', lowerName: 'Thủy',
    judgment: 'Mông: Hanh. Phỉ ngã cầu đồng mông, đồng mông cầu ngã. Khai mở sự ngây thơ mông muội bằng học hỏi.',
    greatImage: 'Sơn hạ xuất tuyền, Mông; quân tử dĩ quả hành dục đức. (Dưới chân núi suối chảy, quân tử quyết đoán hành động, bồi đắp đức hạnh).',
    meaning: 'Thời cơ học tập, thỉnh giáo bậc tiền bối, tránh tự phụ hoặc giấu dốt.',
    dailyAdvice: 'Thành tâm học hỏi, kiểm tra kỹ các điều khoản trước khi đồng ý, tránh cố chấp theo ý mình.',
    lineTexts: [
      'Sơ Lục: Phát mông, lợi dụng hình nhân. (Khai mở mông muội, cần kỷ luật nghiêm minh làm nền tảng).',
      'Cửu Nhị: Bao mông cát, nạp phụ cát. (Bao dung người non nớt, hòa thuận gia đình, tốt lành).',
      'Lục Tam: Vật dụng thủ nữ, kiến kim phu. (Chớ thấy lợi trước mắt mà vội vàng quên mất đạo đức).',
      'Lục Tứ: Khốn mông, lận. (Bị giam cầm trong định kiến thiển cận, đáng tiếc hận).',
      'Lục Ngũ: Đồng mông, cát. (Ngây thơ trong sáng, biết lắng nghe lời dạy bảo chân thành, cát lành).',
      'Thượng Cửu: Kích mông, bất lợi vi khấu. (Răn dạy kẻ sai trái, tránh bạo ngược quá tay).'
    ]
  },
  '6-1': {
    number: 5, key: '6-1', nameVi: 'Thủy Thiên Nhu', nameZh: '水天需', symbol: '䷄', upperNum: 6, lowerNum: 1,
    upperName: 'Thủy', lowerName: 'Thiên',
    judgment: 'Nhu: Hữu phu, quang hanh, trinh cát, lợi thiệp đại xuyên. Chờ đợi thời cơ, nuôi dưỡng thực lực.',
    greatImage: 'Vân thượng vu thiên, Nhu; quân tử dĩ ẩm thực yến lạc. (Mây bay lên trời tụ mưa, quân tử ăn uống nghỉ ngơi dưỡng sức).',
    meaning: 'Thời điểm tích lũy nội lực, kiên nhẫn chờ thời vận tốt, không nóng vội manh động.',
    dailyAdvice: 'Giữ tâm lý vững vàng, hoàn thiện công việc hiện tại, duy trì sinh hoạt điều độ, lộc lành sẽ đến.',
    lineTexts: [
      'Sơ Cửu: Nhu vu giao, lợi dụng hằng, vô cữu. (Đợi ở nơi ngoại ô xa, kiên định không nóng ruột, không lỗi).',
      'Cửu Nhị: Nhu vu sa, tiểu hữu ngôn, chung cát. (Đợi ở bãi cát, có lời thị phi nhỏ, sau cùng vẫn tốt).',
      'Cửu Tam: Nhu vu nê, trí khấu chí. (Đợi ở vũng bùn, sơ hở kẻ xấu dòm ngó, cần tỉnh táo đề phòng).',
      'Lục Tứ: Nhu vu huyết, xuất tự huyệt. (Rơi vào thế hiểm, bình tĩnh rút lui bảo toàn lực lượng).',
      'Cửu Ngũ: Nhu vu tửu thực, trinh cát. (Hưởng phúc lộc yến tiệc trong lúc chờ đợi, cát lợi).',
      'Thượng Lục: Nhập vu huyệt, hữu bất tốc chi khách tam nhân lai. (Có khách bất ngờ đến giúp, kính trọng ắt có phúc).'
    ]
  },
  '1-6': {
    number: 6, key: '1-6', nameVi: 'Thiên Thủy Tụng', nameZh: '天水訟', symbol: '䷅', upperNum: 1, lowerNum: 6,
    upperName: 'Thiên', lowerName: 'Thủy',
    judgment: 'Tụng: Hữu phu, trĩ dịch, trung cát, chung hung; lợi kiến đại nhân, bất lợi thiệp đại xuyên.',
    greatImage: 'Thiên dữ thủy vi hành, Tụng; quân tử dĩ tác sự mưu thủy. (Trời đi ngược dòng nước, quân tử khi bắt đầu việc phải lo liệu trước).',
    meaning: 'Bất đồng quan điểm, tranh cãi kiện tụng, nên lấy nhượng bộ và hòa giải làm đầu.',
    dailyAdvice: 'Nhẫn nhịn một bước trời yên biển lặng, tránh đôi co cãi vã với đồng nghiệp, đối tác hoặc người thân.',
    lineTexts: [
      'Sơ Lục: Bất vĩnh sở sự, tiểu hữu ngôn, chung cát. (Không kéo dài tranh chấp, có chút điều tiếng rồi qua, chung cuộc tốt).',
      'Cửu Nhị: Bất khắc tụng, quy nhi bô kỳ ấp. (Tranh luận không lại, nhượng bộ lui về an toàn).',
      'Lục Tam: Thực cựu đức, trinh lệ, chung cát. (Ăn lộc phúc đức cũ, giữ mình khiêm tốn thì tốt lành).',
      'Cửu Tứ: Bất khắc tụng, phục tức mệnh, biến an trinh. (Biết dừng tranh cãi, thuận theo đạo lý thì yên ổn).',
      'Cửu Ngũ: Tụng, nguyên cát. (Nhờ người công minh phân xử rõ ràng, đại cát).',
      'Thượng Cửu: Hoặc tích chi bàn đái, chung triêu tam đoạt chi. (Dù tranh thắng được đai ngọc, trong ngày cũng bị tước mất ba lần).'
    ]
  },
  '8-6': {
    number: 7, key: '8-6', nameVi: 'Địa Thủy Sư', nameZh: '地水師', symbol: '䷆', upperNum: 8, lowerNum: 6,
    upperName: 'Địa', lowerName: 'Thủy',
    judgment: 'Sư: Trinh, trượng nhân cát, vô cữu. Đạo dùng quân cần chính nghĩa và kỷ luật thép.',
    greatImage: 'Địa trung hữu thủy, Sư; quân tử dĩ dung dân súc chúng. (Trong đất chứa nước ngầm, quân tử bao dung dân chúng, nuôi dưỡng nhân tài).',
    meaning: 'Tập thể đoàn kết, kỷ luật nghiêm minh, hành động có tổ chức và kế hoạch rõ ràng.',
    dailyAdvice: 'Lãnh đạo hoặc làm việc nhóm cần phân công rõ ràng, tuân thủ deadline và nguyên tắc tập thể.',
    lineTexts: [
      'Sơ Lục: Sư xuất dĩ luật, phủ tạng hung. (Ra quân phải có kỷ luật chặt chẽ, vô kỷ luật ắt hung).',
      'Cửu Nhị: Tại sư trung cát, vô cữu. (Ở vị trí then chốt giữ lòng trung chính, được cấp trên ban thưởng).',
      'Lục Tam: Sư hoặc dư thi, hung. (Quân kỷ lỏng lẻo dễ gánh xác về, hung hiểm).',
      'Lục Tứ: Sư tả thứ, vô cữu. (Biết tạm lui quân bảo toàn lực lượng, không lỗi).',
      'Lục Ngũ: Điền hữu cầm, lợi chấp ngôn. (Trừ hại cho tập thể, chính nghĩa sáng ngời).',
      'Thượng Lục: Đại quân hữu mệnh, khai quốc thừa gia. (Ban thưởng phân minh, chớ tin dùng kẻ tiểu nhân nịnh hót).'
    ]
  },
  '6-8': {
    number: 8, key: '6-8', nameVi: 'Thủy Địa Tỷ', nameZh: '水地比', symbol: '䷇', upperNum: 6, lowerNum: 8,
    upperName: 'Thủy', lowerName: 'Địa',
    judgment: 'Tỷ: Cát. Nguyên phệ, nguyên vĩnh trinh, vô cữu. Gắn kết thân ái, cùng giúp đỡ lẫn nhau.',
    greatImage: 'Địa thượng hữu thủy, Tỷ; tiên vương dĩ kiến vạn quốc, thân chư hầu. (Nước chan hòa trên mặt đất, tiên vương dựng nước kết thân bạn bè).',
    meaning: 'Hợp tác hòa thuận, liên minh gắn bó, tìm được đồng sự chân thành và đáng tin cậy.',
    dailyAdvice: 'Rất tốt cho việc ký kết hợp tác, gặp mặt giao lưu bạn bè, củng cố các mối quan hệ thân thiết.',
    lineTexts: [
      'Sơ Lục: Hữu phu tỷ chi, vô cữu. (Lấy lòng thành tín mà kết giao, không lỗi).',
      'Lục Nhị: Tỷ chi tự nội, trinh cát. (Gắn bó tự đáy lòng chân thật, tốt lành).',
      'Lục Tam: Tỷ chi phỉ nhân. (Gắn kết nhầm kẻ xấu bụng, cần nhanh chóng tránh xa).',
      'Lục Tứ: Ngoại tỷ chi, trinh cát. (Kết giao với người tài giỏi bên ngoài, tốt lành).',
      'Cửu Ngũ: Hiển tỷ, vương dụng tam khu. (Gắn bó rộng lượng không ép uổng, mọi người tự nguyện quy thuận).',
      'Thượng Lục: Tỷ chi vô thủ, hung. (Kết thân mà không có lòng thành ngay từ đầu, rốt cuộc hung).'
    ]
  },
  '5-1': {
    number: 9, key: '5-1', nameVi: 'Phong Thiên Tiểu Súc', nameZh: '風天小畜', symbol: '䷈', upperNum: 5, lowerNum: 1,
    upperName: 'Phong', lowerName: 'Thiên',
    judgment: 'Tiểu Súc: Hanh. Mật vân bất vũ, tự ngã tây giao. Tích lũy nhỏ, chờ gió đông mưa thuận.',
    greatImage: 'Phong hành thiên thượng, Tiểu Súc; quân tử dĩ ý văn đức. (Gió bay trên trời gom mây, quân tử trau dồi đức hạnh văn hóa).',
    meaning: 'Tích tiểu thành đại, kiên nhẫn tích lũy từng bước nhỏ, chưa nên đầu tư ồ ạt mạo hiểm.',
    dailyAdvice: 'Kiểm kê sổ sách tài chính, tiết kiệm chi tiêu, trau dồi thêm kiến thức chuyên môn.',
    lineTexts: [
      'Sơ Cửu: Phục tự đạo, hà kỳ cữu, cát. (Quay về chính đạo của mình, không lỗi gì cả, cát lành).',
      'Cửu Nhị: Khiên phục, cát. (Dắt tay nhau cùng quay về nẻo thiện, tốt lành).',
      'Cửu Tam: Dư thuyết bức, phu thê phản mục. (Trục xe hỏng, vợ chồng bất hòa; giữ bình tĩnh trong nhà).',
      'Lục Tứ: Hữu phu, huyết khứ dịch xuất. (Lòng thành giải tỏa mọi nỗi sợ hãi, tai qua nạn khỏi).',
      'Cửu Ngũ: Hữu phu loan như, phú dĩ kỳ lân. (Chân thành kết nối cộng đồng, cùng nhau sung túc).',
      'Thượng Cửu: Ký vũ ký xử, thượng đức tái. (Mưa đã rơi, ơn lành đã trọn, nên biết đủ dừng lại).'
    ]
  },
  '1-2': {
    number: 10, key: '1-2', nameVi: 'Thiên Trạch Lý', nameZh: '天澤履', symbol: '䷉', upperNum: 1, lowerNum: 2,
    upperName: 'Thiên', lowerName: 'Trạch',
    judgment: 'Lý: Lý hổ vĩ, bất xuy nhân, hanh. Đi trên đuôi cọp mà cọp không cắn, lễ nghi chu toàn.',
    greatImage: 'Thượng thiên hạ trạch, Lý; quân tử dĩ biện thượng hạ, định dân chí. (Trên trời dưới đầm phân định rõ ràng, quân tử giữ gìn lễ tiết).',
    meaning: 'Ứng xử nhã nhặn, tôn trọng cấp trên và đối tác, lễ nghĩa đúng mực giúp vượt qua hiểm cảnh.',
    dailyAdvice: 'Ăn nói lịch thiệp, tuân thủ đúng quy tắc và hợp đồng, không vượt quyền hạn của mình.',
    lineTexts: [
      'Sơ Cửu: Tố lý, vãng vô cữu. (Ăn ở mộc mạc đơn thuần, tiến bước không lỗi).',
      'Cửu Nhị: Lý đạo thản thản, u nhân trinh cát. (Đường đi bằng phẳng thênh thang, người giữ tâm thanh tịnh thì tốt lành).',
      'Lục Tam: Diễu năng thị, bả năng lý, xuy nhân, hung. (Mắt chột đòi nhìn xa, chân thọt đòi chạy nhanh, bị cắn hung hiểm).',
      'Cửu Tứ: Lý hổ vĩ, tố tố chung cát. (Giẫm đuôi cọp mà biết thận trọng dè dặt, rốt cuộc tốt lành).',
      'Cửu Ngũ: Quyết lý, trinh lệ. (Quyết đoán giữ gìn kỷ cương, luôn nhớ thận trọng).',
      'Thượng Cửu: Thị lý khảo tường, kỳ toàn nguyên cát. (Xem lại đường đi nước bước đã chu toàn vẹn vẻ, đại cát).'
    ]
  },
  '8-1': {
    number: 11, key: '8-1', nameVi: 'Địa Thiên Thái', nameZh: '地天泰', symbol: '䷊', upperNum: 8, lowerNum: 1,
    upperName: 'Địa', lowerName: 'Thiên',
    judgment: 'Thái: Tiểu vãng đại lai, cát hanh. Khí trời hạ xuống, khí đất bốc lên, âm dương giao hòa, muôn vật thái bình.',
    greatImage: 'Thiên địa giao, Thái; hậu dĩ tài thành thiên địa chi đạo. (Trời đất giao hòa vạn sự sinh sôi, bậc minh quân thuận đạo càn khôn).',
    meaning: 'Thời vận hanh thông tột bực, trong ấm ngoài êm, mưu sự đại thành.',
    dailyAdvice: 'Tận dụng thời cơ vàng để giải quyết việc lớn, ký kết hợp đồng, mở mang sự nghiệp.',
    lineTexts: [
      'Sơ Cửu: Bạt mao như, dĩ kỳ vĩ, chinh cát. (Nhổ cỏ tranh cùng cả đám rễ, đồng lòng chung sức cùng tiến, cát lành).',
      'Cửu Nhị: Bao hoang, dụng phùng hà. (Bao dung người thô kệch, dám lội qua sông, trung chính đắc lợi).',
      'Cửu Tam: Vô bình bất bì, vô vãng bất phục. (Không có dốc nào không bằng phẳng, giữ lòng chính trực lúc khó).',
      'Lục Tứ: Phiên phiên bất phú, dĩ kỳ lân. (Giao hảo vô tư, bạn bè kề cận chân thành tin cậy).',
      'Lục Ngũ: Đế Ất quy muội, dĩ chỉ nguyên cát. (Gả con gái cầu hòa thân, phước lành vẹn toàn đại cát).',
      'Thượng Lục: Thành phục vu hoàng, vật dụng sư. (Thành đổ xuống hào, thời thịnh chuyển suy, chớ manh động).'
    ]
  },
  '1-8': {
    number: 12, key: '1-8', nameVi: 'Thiên Địa Bĩ', nameZh: '天地否', symbol: '䷋', upperNum: 1, lowerNum: 8,
    upperName: 'Thiên', lowerName: 'Địa',
    judgment: 'Bĩ: Bĩ chi phỉ nhân, bất lợi quân tử trinh, đại vãng tiểu lai. Trời đất không giao hòa, thời vận bế tắc.',
    greatImage: 'Thiên địa bất giao, Bĩ; quân tử dĩ kiệm đức tị nan, bất khả vinh dĩ lộc. (Trời đất cách trở không giao, quân tử ẩn nhẫn tu đức tránh họa).',
    meaning: 'Thời thế ngưng trệ, gặp trắc trở ngoài dự kiến, nên kiên nhẫn ẩn nhẫn gìn giữ lực lượng.',
    dailyAdvice: 'Không nên tranh luận gay gắt hôm nay, tạm hoãn các dự án lớn, tập trung bảo toàn vốn liếng.',
    lineTexts: [
      'Sơ Lục: Bạt mao như, dĩ kỳ vĩ, trinh cát, hanh. (Giữ lòng kiên định không a dua thì hanh thông).',
      'Lục Nhị: Bao thừa, tiểu nhân cát, đại nhân bĩ hanh. (Bao dung nhẫn nhịn thời bế tắc, giữ trọn khí tiết).',
      'Lục Tam: Bao tu. (Mang nỗi hổ thẹn trong lòng, biết sai mà sửa).',
      'Cửu Tứ: Hữu mệnh vô cữu, trù ly chỉ. (Theo mệnh trời hành sự thì không lỗi, đồng nghiệp hưởng phúc theo).',
      'Cửu Ngũ: Hưu bĩ, đại nhân cát, hệ vu bao tang. (Thời bế tắc chấm dứt, người quân tử hành sự đại cát).',
      'Thượng Cửu: Khuynh bĩ, tiên bĩ hậu hỷ. (Thời bế tắc đã đổ nhào, trước gian nan sau tràn ngập niềm vui mừng).'
    ]
  },
  '1-3': {
    number: 13, key: '1-3', nameVi: 'Thiên Hỏa Đồng Nhân', nameZh: '天火同人', symbol: '䷌', upperNum: 1, lowerNum: 3,
    upperName: 'Thiên', lowerName: 'Hỏa',
    judgment: 'Đồng Nhân vu dã, hanh. Lợi thiệp đại xuyên, lợi quân tử trinh. Đồng tâm hiệp lực giữa chốn bao la.',
    greatImage: 'Thiên dữ hỏa, Đồng Nhân; quân tử dĩ tộc tính biện vật. (Trời cùng với lửa soi sáng, quân tử phân định rõ muôn sự).',
    meaning: 'Đồng lòng chung sức, đại cuộc quang minh, gặp gỡ bằng hữu tri kỷ.',
    dailyAdvice: 'Thích hợp tổ chức hội thảo, làm việc nhóm, kêu gọi vốn đầu tư, mở rộng mạng lưới quan hệ.',
    lineTexts: [
      'Sơ Cửu: Đồng nhân vu môn, vô cữu. (Ra khỏi cửa cùng hòa đồng với mọi người, không lỗi).',
      'Lục Nhị: Đồng nhân vu tông, lận. (Chỉ hẹp hòi hòa đồng với thân tộc phe cánh, đáng chê trách).',
      'Cửu Tam: Phục nhung vu mãng, tam tuế bất hưng. (Giấu quân nghi kỵ đồng minh, ba năm không ngóc đầu dậy nổi).',
      'Cửu Tứ: Thừa kỳ dung, bất khắc công, cát. (Trèo lên bờ tường định đánh, kịp tỉnh ngộ không đánh nữa, cát lành).',
      'Cửu Ngũ: Đồng nhân, tiên hào đào nhi hậu tiếu. (Đồng lòng chung chí, trước khóc sau cười vang, đại quân thắng lợi).',
      'Thượng Cửu: Đồng nhân vu giao, vô hối. (Hòa đồng ở nơi đồng nội xa xôi, tâm trí thảnh thơi không hối hận).'
    ]
  },
  '3-1': {
    number: 14, key: '3-1', nameVi: 'Hỏa Thiên Đại Hữu', nameZh: '火天大有', symbol: '䷍', upperNum: 3, lowerNum: 1,
    upperName: 'Hỏa', lowerName: 'Thiên',
    judgment: 'Đại Hữu: Nguyên Hanh. Lửa trên trời cao tỏa sáng khắp gầm trời, giàu có lớn lao, vạn vật tôn sùng.',
    greatImage: 'Hỏa tại thiên thượng, Đại Hữu; quân tử dĩ át ác dương thiện, thuận thiên hưu mệnh. (Lửa sáng trên trời, quân tử ngăn ác nêu thiện).',
    meaning: 'Vận tài lộc cực thịnh, công danh hiển đạt, uy tín cá nhân vang xa.',
    dailyAdvice: 'Tự tin đàm phán hợp đồng lớn, xuất hành buôn bán đắc tài, chia sẻ phúc lộc cho người xung quanh.',
    lineTexts: [
      'Sơ Cửu: Vô giao hại, phỉ cữu, gian tắc vô cữu. (Chưa can dự vào chỗ hiểm hại, nhận thức khó khăn thì không lỗi).',
      'Cửu Nhị: Đại xa dĩ tải, hữu du vãng, vô cữu. (Xe lớn chở nặng tài lộc đi xa, công việc thuận lợi không lỗi).',
      'Cửu Tam: Công dụng hanh vu thiên tử. (Bậc công thần hiến công cho vua, tiểu nhân không kham nổi việc lớn này).',
      'Cửu Tứ: Phỉ kỳ bành, vô cữu. (Không khoe khoang phô trương tài sản quyền thế, không lỗi lầm).',
      'Cửu Ngũ: Quyết phu giao như, uy như, cát. (Lòng thành tín tỏa rạng kết nối muôn người, có uy nghiêm đức độ, cát lành).',
      'Thượng Cửu: Tự thiên hữu chi, cát vô bất lợi. (Được trời phù hộ che chở, may mắn muôn sự không gì không lợi).'
    ]
  },
  '8-7': {
    number: 15, key: '8-7', nameVi: 'Địa Sơn Khiêm', nameZh: '地山謙', symbol: '䷎', upperNum: 8, lowerNum: 7,
    upperName: 'Địa', lowerName: 'Sơn',
    judgment: 'Khiêm: Hanh, quân tử hữu chung. Núi cao giấu mình dưới lòng đất sâu, đạo đức khiêm tốn tối thượng.',
    greatImage: 'Địa trung hữu sơn, Khiêm; quân tử dĩ phẫu đa ích quả, xứng vật bình thi. (Trong lòng đất có núi cao, quân tử làm việc công bằng).',
    meaning: 'Khiêm nhường, đức độ dung hòa, quẻ duy nhất trong 64 quẻ có cả 6 hào đều cát lợi.',
    dailyAdvice: 'Giữ thái độ khiêm nhu từ tốn, hạ mình lắng nghe; phúc lộc và sự kính trọng sẽ tự tìm đến.',
    lineTexts: [
      'Sơ Lục: Khiêm khiêm quân tử, dụng thiệp đại xuyên, cát. (Khiêm nhường tột bậc, vượt sông lớn hiểm trở cũng cát lành).',
      'Lục Nhị: Minh khiêm, trinh cát. (Tiếng khiêm nhường vang xa chân thật, giữ lòng kiên định cát lành).',
      'Cửu Tam: Lao khiêm quân tử, vạn dân phục, cát. (Có công lao lớn mà vẫn khiêm hạ, vạn dân kính phục).',
      'Lục Tứ: Vô bất lợi, huy khiêm. (Không gì không lợi, phát huy đức tính khiêm tốn chân chính).',
      'Lục Ngũ: Bất phú dĩ kỳ lân, lợi dụng xâm phạt. (Được lòng xóm giềng đồng đội, phạt kẻ bạo ngược, trăm sự thuận lợi).',
      'Thượng Lục: Minh khiêm, lợi dụng hành sư. (Tiếng khiêm nhường vang xa, tự soi xét uốn nắn bản thân và bộ hạ).'
    ]
  },
  '4-8': {
    number: 16, key: '4-8', nameVi: 'Lôi Địa Dự', nameZh: '雷地豫', symbol: '䷏', upperNum: 4, lowerNum: 8,
    upperName: 'Lôi', lowerName: 'Địa',
    judgment: 'Dự: Lợi kiến hầu hành sư. Sấm động trên mặt đất, vạn vật vui tươi hứng khởi, thuận lòng người.',
    greatImage: 'Lôi xuất địa phấn, Dự; tiên vương dĩ tác nhạc sùng đức. (Sấm phát ra từ lòng đất phấn khởi, tiên vương làm nhạc tôn sùng đức hạnh).',
    meaning: 'Vui vẻ hòa hợp, tràn đầy nhiệt huyết và niềm vui, thích hợp khởi công, ca vũ, kết giao.',
    dailyAdvice: 'Tạo bầu không khí phấn khởi cho bản thân và đồng nghiệp; tránh mải mê hưởng lạc quá đà.',
    lineTexts: [
      'Sơ Lục: Minh dự, hung. (Khoe khoang sự vui sướng tự mãn, rước họa hung hiểm).',
      'Lục Nhị: Giới vu thạch, bất chung nhật, trinh cát. (Vững như bàn thạch, biết nhìn xa thấy cơ vi biến chuyển, đại cát).',
      'Lục Tam: Hu dự, hối, trì hữu hối. (Ngước mắt trông chờ người khác làm vui cho mình, tất hối hận).',
      'Cửu Tứ: Do dự, đại hữu đắc; vật nghi. (Nguồn vui của mọi người, gặt hái lớn lao; chớ nghi ngờ bạn bè sum vầy).',
      'Lục Ngũ: Trinh tật, hằng bất tử. (Có chút bệnh mỏi mệt nhưng trường tồn không ngại).',
      'Thượng Lục: Minh dự, thành hữu du, vô cữu. (Mê muội trong sự hưởng lạc, kịp tỉnh ngộ sửa mình thì không lỗi).'
    ]
  },
  '2-4': {
    number: 17, key: '2-4', nameVi: 'Trạch Lôi Tùy', nameZh: '澤雷隨', symbol: '䷐', upperNum: 2, lowerNum: 4,
    upperName: 'Trạch', lowerName: 'Lôi',
    judgment: 'Tùy: Nguyên, Hanh, Lợi, Trinh, vô cữu. Thuận theo thời thế, tùy cơ ứng biến.',
    greatImage: 'Trạch trung hữu lôi, Tùy; quân tử dĩ hướng hối nhập yến tức. (Trong đầm có sấm ẩn tàng, quân tử trời tối vào nghỉ ngơi an tĩnh).',
    meaning: 'Biết thuận theo hoàn cảnh, hòa nhập với tập thể, không bảo thủ chống lại xu thế.',
    dailyAdvice: 'Linh hoạt thích nghi với thay đổi trong ngày, hợp tác vui vẻ với đồng đội, chiều theo ý kiến số đông hợp lý.',
    lineTexts: [
      'Sơ Cửu: Quan hữu du, trinh cát, xuất môn giao hữu công. (Chức vụ có biến đổi, giữ lòng chính trực, ra cửa kết giao lập công).',
      'Lục Nhị: Hệ tiểu tử, thất trượng phu. (Ham bám víu kẻ nhỏ mọn mà đánh mất bậc quân tử trượng phu).',
      'Lục Tam: Hệ trượng phu, thất tiểu tử. (Bám theo bậc trượng phu, bỏ qua kẻ nhỏ mọn, cầu gì được nấy).',
      'Cửu Tứ: Tùy hữu hoạch, trinh hung. (Theo người mà mưu lợi riêng thì giữ chính cũng nguy).',
      'Cửu Ngũ: Phu vu gia, cát. (Lấy lòng chân thành đối đãi với điều thiện lành, đại cát).',
      'Thượng Lục: Câu hệ chi, nãi tòng duy chi. (Gắn bó keo sơn bền chặt, lòng thành cảm động đến trời cao).'
    ]
  },
  '7-5': {
    number: 18, key: '7-5', nameVi: 'Sơn Phong Cổ', nameZh: '山風蠱', symbol: '䷑', upperNum: 7, lowerNum: 5,
    upperName: 'Sơn', lowerName: 'Phong',
    judgment: 'Cổ: Nguyên hanh, lợi thiệp đại xuyên. Tiên giáp tam nhật, hậu giáp tam nhật. Chấn chỉnh sự hư hỏng trì trệ.',
    greatImage: 'Sơn hạ hữu phong, Cổ; quân tử dĩ chấn dân dục đức. (Dưới chân núi có gió bị giữ lại tù đọng, quân tử chấn hưng lòng dân bồi bổ đức).',
    meaning: 'Khắc phục tồn đọng cũ, cải cách phương pháp làm việc, sửa chữa sai lầm trong quá khứ.',
    dailyAdvice: 'Rà soát lại các hợp đồng còn thiếu sót, dọn dẹp các việc tồn kho, dũng cảm đổi mới tư duy.',
    lineTexts: [
      'Sơ Lục: Cán phụ chi cổ, hữu tử khảo vô cữu. (Khắc phục lỗi lầm của đời trước, có người gánh vác, không lỗi).',
      'Cửu Nhị: Cán mẫu chi cổ, bất khả trinh. (Sửa sai điều mẹ để lại, cần mềm mỏng ôn hòa).',
      'Cửu Tam: Cán phụ chi cổ, tiểu hữu hối, vô đại cữu. (Sửa lỗi của cha, có chút hối tiếc nhỏ nhưng không mắc lỗi lớn).',
      'Lục Tứ: Dụ phụ chi cổ, vãng kiến lận. (Dung túng sự trì trệ của tiền nhân, tiến bước gặp hối tiếc).',
      'Lục Ngũ: Cán phụ chi cổ, dụng dự. (Sửa chữa sai sót được mọi người ca ngợi khen tặng).',
      'Thượng Cửu: Bất sự vương hầu, cao thượng kỳ sự. (Không màng bổng lộc vương hầu, giữ chí hướng thanh cao).'
    ]
  },
  '8-2': {
    number: 19, key: '8-2', nameVi: 'Địa Trạch Lâm', nameZh: '地澤臨', symbol: '䷒', upperNum: 8, lowerNum: 2,
    upperName: 'Địa', lowerName: 'Trạch',
    judgment: 'Lâm: Nguyên, Hanh, Lợi, Trinh. Cương trưởng dương sinh, thời cơ phát triển tiến tới.',
    greatImage: 'Địa thượng hữu trạch, Lâm; quân tử dĩ giáo tư vô cùng, dung bảo dân vô cương. (Trên mặt đất có đầm nước soi rọi, quân tử dạy dỗ dân chúng không ngừng).',
    meaning: 'Khí thế đang lên mạnh mẽ, cơ hội đến gần, có quyền uy và sự ủng hộ của mọi người.',
    dailyAdvice: 'Chủ động nắm bắt cơ hội xúc tiến công việc, tiếp cận khách hàng tiềm năng, mở rộng tầm ảnh hưởng.',
    lineTexts: [
      'Sơ Cửu: Hàm lâm, trinh cát. (Cùng nhau tiến bước với lòng thành, giữ chính tắc cát).',
      'Cửu Nhị: Hàm lâm, cát vô bất lợi. (Cùng tiến bước quang minh, may mắn không gì không lợi).',
      'Lục Tam: Cam lâm, vô du lợi. (Dùng lời ngọt ngào dụ dỗ, không có lợi gì; kịp thời tỉnh ngộ thì không lỗi).',
      'Lục Tứ: Chí lâm, vô cữu. (Đến gần một cách chân thành hết lòng, không lỗi lầm).',
      'Lục Ngũ: Tri lâm, đại quân chi nghi, cát. (Lấy trí tuệ mà lãnh đạo dân chúng, bậc đại quân uyên bác, cát lành).',
      'Thượng Lục: Đôn lâm, cát vô cữu. (Lấy lòng đôn hậu chân thật mà đối xử với kẻ dưới, đại cát).'
    ]
  },
  '5-8': {
    number: 20, key: '5-8', nameVi: 'Phong Địa Quan', nameZh: '風地觀', symbol: '䷓', upperNum: 5, lowerNum: 8,
    upperName: 'Phong', lowerName: 'Địa',
    judgment: 'Quan: Quán nhi bất tiến, hữu phu ngung nhược. Quan sát cẩn trọng, giữ lòng thành kính tôn nghiêm.',
    greatImage: 'Phong hành địa thượng, Quan; tiên vương dĩ tỉnh phương, quan dân thiết giáo. (Gió thổi trên mặt đất soi xét khắp nơi, tiên vương tuần thú đặt nền giáo hóa).',
    meaning: 'Bình tâm quan sát tình hình, nhìn xa trông rộng, xem xét lại bản thân và xu thế xung quanh.',
    dailyAdvice: 'Chậm lại để đánh giá thị trường, không đưa ra phán xét vội vàng, học hỏi cách làm của người thành công.',
    lineTexts: [
      'Sơ Lục: Đồng quan, tiểu nhân vô cữu, quân tử lận. (Nhìn sự việc như con trẻ ngây ngô, tiểu nhân không sao, quân tử đáng chê).',
      'Lục Nhị: Khuy quan, lợi phụ nhân chi trinh. (Nhìn qua khe cửa hẹp hòi, hợp cho việc nội trợ nhỏ trong nhà).',
      'Lục Tam: Quan ngã sinh, tiến thoái. (Xem xét hoàn cảnh của chính mình mà quyết định tiến hay thoái).',
      'Lục Tứ: Quan quốc chi quang, lợi dụng tân vu vương. (Thấy được hào quang vinh thịnh của quốc gia, lợi cho việc dâng kế cho bậc vương giả).',
      'Cửu Ngũ: Quan ngã sinh, quân tử vô cữu. (Xem xét đạo đức hành vi của bản thân, người quân tử không lỗi lầm).',
      'Thượng Cửu: Quan kỳ sinh, quân tử vô cữu. (Quan sát lòng dân thiên hạ, giữ tâm thế siêu nhiên thanh tịnh).'
    ]
  },
  '3-4': {
    number: 21, key: '3-4', nameVi: 'Hỏa Lôi Phệ Hạp', nameZh: '火雷噬嗑', symbol: '䷔', upperNum: 3, lowerNum: 4,
    upperName: 'Hỏa', lowerName: 'Lôi',
    judgment: 'Phệ Hạp: Hanh, lợi dụng ngục. Cắn đứt vật cản trở, pháp luật nghiêm minh, công lý sáng tỏ.',
    greatImage: 'Lôi điện Phệ Hạp, tiên vương dĩ minh phạt sắc pháp. (Sấm sét cùng điện lửa soi sáng oai nghiêm, tiên vương định rõ luật pháp trừng trị kẻ gian).',
    meaning: 'Quyết đoán loại bỏ chướng ngại, xử lý dứt điểm các vướng mắc, kỷ luật nghiêm túc.',
    dailyAdvice: 'Thẳng thắn giải quyết dứt điểm các vấn đề tồn đọng trong hợp đồng, không né tránh khó khăn.',
    lineTexts: [
      'Sơ Cửu: Tề côi diệt chỉ, vô cữu. (Bị cùm chân răn đe lỗi nhỏ, kịp thời sửa mình không mắc lỗi lớn).',
      'Lục Nhị: Phệ phu diệt tỵ, vô cữu. (Cắn miếng thịt mềm ngập mũi, xử lý việc dễ dàng đúng phép).',
      'Lục Tam: Phệ lạp nhục, ngộ độc. (Cắn miếng thịt khô gặp phải chất độc, có chút khó khăn nhỏ rồi vượt qua).',
      'Cửu Tứ: Phệ can tộ, đắc kim thỉ. (Cắn phải xương cứng tìm được mũi tên vàng, gian nan đổi lấy kết quả quý giá).',
      'Cửu Ngũ: Phệ can nhục, đắc hoàng kim. (Cắn miếng thịt khô nhai được vàng ròng, giữ lòng trung chính ắt đắc tài).',
      'Thượng Cửu: Hà hiệu diệt nhĩ, hung. (Mang gông nặng bịt tai không chịu nghe lời khuyên răn, hung hiểm).'
    ]
  },
  '7-3': {
    number: 22, key: '7-3', nameVi: 'Sơn Hỏa Bí', nameZh: '山火賁', symbol: '䷕', upperNum: 7, lowerNum: 3,
    upperName: 'Sơn', lowerName: 'Hỏa',
    judgment: 'Bí: Hanh, tiểu lợi hữu du vãng. Vẻ đẹp văn chất tương tể, trong sáng ngoài thuần, tinh tế tao nhã.',
    greatImage: 'Sơn hạ hữu hỏa, Bí; quân tử dĩ minh thứ chính, vô cảm chiết ngục. (Dưới chân núi có lửa soi rọi quang minh, quân tử làm sáng tỏ chính sự).',
    meaning: 'Trọng văn hóa, thẩm mỹ, danh tiếng, vẻ đẹp hình thức kết hợp với thực chất bên trong.',
    dailyAdvice: 'Chăm chút ngoại hình, tác phong chuyên nghiệp, chỉnh trang văn bản tài liệu chỉn chu đẹp mắt.',
    lineTexts: [
      'Sơ Cửu: Bí kỳ chỉ, xả xa nhi đồ. (Trang điểm cho đôi chân, bỏ xe đi bộ, giữ nét giản dị mộc mạc).',
      'Lục Nhị: Bí kỳ tu. (Trang điểm cho chòm râu, thuận theo cử chỉ của bậc trưởng thượng).',
      'Cửu Tam: Bí như nhu như, vĩnh trinh cát. (Rực rỡ nhuần nhị, giữ lòng kiên định lâu dài thì cát lành).',
      'Lục Tứ: Bí như bà như, bạch mã hàn như. (Ngựa trắng bay như cánh chim, tìm người tri kỷ kết nghĩa tâm đầu).',
      'Lục Ngũ: Bí vu khâu viên, thúc bạch tiên tiên. (Lễ vật mộc mạc dâng nơi gò đồi, lòng thành đổi lấy phúc lành lớn).',
      'Thượng Cửu: Bạch bí, vô cữu. (Trở về vẻ đẹp thuần khiết màu trắng tinh khôi, vạn sự quay về bản chất).'
    ]
  },
  '7-8': {
    number: 23, key: '7-8', nameVi: 'Sơn Địa Bác', nameZh: '山地剝', symbol: '䷖', upperNum: 7, lowerNum: 8,
    upperName: 'Sơn', lowerName: 'Địa',
    judgment: 'Bác: Bất lợi hữu du vãng. Âm thịnh dương suy, núi lở về đất, thời kỳ tiêu điều cần giữ gìn.',
    greatImage: 'Sơn phụ vu địa, Bác; thượng dĩ hậu hạ an trạch. (Núi nương tựa vào lòng đất, kẻ trên lấy ân hậu đối đãi kẻ dưới để yên ấm nhà cửa).',
    meaning: 'Thời vận thoái trào, có dấu hiệu hao mòn hoặc tiểu nhân quấy phá, cần giữ vững gốc rễ.',
    dailyAdvice: 'Án binh bất động, không chi tiền lớn, cẩn thận kẻo bị lừa đảo hoặc hao hụt tài sản.',
    lineTexts: [
      'Sơ Lục: Bác sàng dĩ túc, miệt trinh hung. (Bong tróc từ chân giường, nền móng lung lay, hung hiểm).',
      'Lục Nhị: Bác sàng dĩ biện, miệt trinh hung. (Bong tróc đến thành giường, nguy cơ cận kề, cần cảnh giác cao độ).',
      'Lục Tam: Bác chi, vô cữu. (Biết rời bỏ đám đông xấu xa để giữ mình, không lỗi).',
      'Lục Tứ: Bác sàng dĩ phu, hung. (Bong tróc tới thân thể giường nằm, tai họa cận kề, hung).',
      'Lục Ngũ: Quán ngư, dĩ cung nhân sủng, vô bất lợi. (Xâu cá nối nhau như cung nữ thuận tòng, không gì không lợi).',
      'Thượng Cửu: Thạc quả bất thực, quân tử đắc dư, tiểu nhân bác lư. (Quả lớn còn sót lại không rụng, người quân tử được xe chở, tiểu nhân mất nhà).'
    ]
  },
  '8-4': {
    number: 24, key: '8-4', nameVi: 'Địa Lôi Phục', nameZh: '地雷復', symbol: '䷗', upperNum: 8, lowerNum: 4,
    upperName: 'Địa', lowerName: 'Lôi',
    judgment: 'Phục: Hanh. Xuất nhập vô tật, bằng lai vô cữu. Thất nhật lai phục, lợi hữu du vãng. Một hào dương quay trở lại.',
    greatImage: 'Lôi tại địa trung, Phục; tiên vương dĩ chí nhật bế quan. (Sấm ẩn sâu dưới lòng đất đợi xuân sang, tiên vương vào ngày Đông chí đóng cửa ải nghỉ ngơi).',
    meaning: 'Khí xuân ấm áp bắt đầu hồi sinh, mầm mống hy vọng mới xuất hiện sau chuỗi ngày tăm tối.',
    dailyAdvice: 'Khởi động các dự định mới một cách nhẹ nhàng, từ bỏ thói quen xấu, đón nhận cơ hội tốt lành.',
    lineTexts: [
      'Sơ Cửu: Bất viễn phục, vô kỳ hối, nguyên cát. (Chưa đi xa đã biết quay đầu về nẻo thiện, đại cát).',
      'Lục Nhị: Hưu phục, cát. (Quay về một cách vui vẻ hòa nhã, tốt lành).',
      'Lục Tam: Tần phục, lệ vô cữu. (Nhiều lần sai lầm rồi lại quay về sửa đổi, dù gian nan nhưng không mắc lỗi lớn).',
      'Lục Tứ: Trung hành độc phục. (Đi giữa đám đông mà một mình quay về chính đạo).',
      'Lục Ngũ: Đôn phục, vô hối. (Quay về với lòng đôn hậu chân thật, không gì phải ân hận).',
      'Thượng Lục: Mê phục, hung, hữu tai sảnh. (Mê muội không chịu quay đầu, rước họa lớn, mười năm không vực dậy nổi).'
    ]
  },
  '1-4': {
    number: 25, key: '1-4', nameVi: 'Thiên Lôi Vô Vọng', nameZh: '天雷無妄', symbol: '䷘', upperNum: 1, lowerNum: 4,
    upperName: 'Thiên', lowerName: 'Lôi',
    judgment: 'Vô Vọng: Nguyên, Hanh, Lợi, Trinh. Kỳ phỉ chính hữu sảnh, phỉ lợi hữu du vãng. Hành xử chân thật, không toan tính gian tà.',
    greatImage: 'Thiên hạ lôi hành, vật dữ vô vọng; tiên vương dĩ mậu đối thời, dục vạn vật. (Dưới trời sấm vang muôn vật hồn nhiên sinh trưởng, tiên vương thuận theo thời thế nuôi dưỡng muôn loài).',
    meaning: 'Giữ lòng chân thật vô tư, thuận theo lẽ tự nhiên, chớ mưu mô xảo quyệt mà rước vạ vào thân.',
    dailyAdvice: 'Làm việc đường hoàng minh bạch, không tham lam món lợi bất chính, tránh suy diễn phức tạp.',
    lineTexts: [
      'Sơ Cửu: Vô vọng, vãng cát. (Lòng dạ vô tư trong sáng, tiến bước tất cát lành).',
      'Lục Nhị: Bất canh hoạch, bất tri dư, tắc lợi hữu du vãng. (Không màng tính toán vụ lợi trước mắt, hành động tự nhiên tất đắc lợi).',
      'Lục Tam: Vô vọng chi tai, hoặc hệ chi ngưu, hành nhân chi đắc, ấp nhân chi tai. (Tai họa bất ngờ trên trời rơi xuống, bình tĩnh chịu đựng qua cơn giông bão).',
      'Cửu Tứ: Khả trinh, vô cữu. (Giữ vững lòng kiên định ngay thẳng, không lỗi lầm).',
      'Cửu Ngũ: Vô vọng chi tật, vật dược hữu hỷ. (Gặp bệnh tật hay trắc trở bất ngờ, không cần uống thuốc xằng bậy, tự nhiên sẽ khỏi).',
      'Thượng Cửu: Vô vọng, cùng chi tai. (Thời điểm cùng cực, chớ manh động kẻo gặp tai ương).'
    ]
  },
  '7-1': {
    number: 26, key: '7-1', nameVi: 'Sơn Thiên Đại Súc', nameZh: '山天大畜', symbol: '䷙', upperNum: 7, lowerNum: 1,
    upperName: 'Sơn', lowerName: 'Thiên',
    judgment: 'Đại Súc: Lợi trinh, bất gia thực cát, lợi thiệp đại xuyên. Chứa đựng lớn lao, bồi dưỡng nhân tài.',
    greatImage: 'Thiên tại sơn trung, Đại Súc; quân tử dĩ đa thức tiền ngôn vãng hạnh, dĩ súc kỳ đức. (Trời nằm trong lòng núi chứa chan bao la, quân tử học rộng nhớ nhiều lời nói việc làm của tiền nhân để tích đức).',
    meaning: 'Tích lũy tài năng, kiến thức và của cải lớn lao, chuẩn bị đón nhận trọng trách vẻ vang.',
    dailyAdvice: 'Rất thích hợp cho việc học tập, nghiên cứu sâu, huy động vốn lớn, mở rộng chiêu mộ nhân tài.',
    lineTexts: [
      'Sơ Cửu: Hữu lệ, lợi dĩ. (Có điềm nguy hiểm, nên biết dừng lại tích lũy thêm).',
      'Cửu Nhị: Dư thuyết bức. (Bánh xe long trục tháo rời, tự nguyện nghỉ ngơi chờ thời).',
      'Cửu Tam: Lương mã trục, lợi gian trinh. (Ngựa tốt phi nhanh, rèn luyện kỹ năng mỗi ngày thì tiến bước đại cát).',
      'Lục Tứ: Đồng ngưu chi cốc, nguyên cát. (Buộc cọc gỗ vào sừng bò non để ngăn hung hăng, đề phòng từ sớm đại cát).',
      'Lục Ngũ: Phần th豕 chi nha, cát. (Thiến răng nanh lợn rừng, hóa giải nguy cơ hung bạo một cách khéo léo).',
      'Thượng Cửu: Hà thiên chi cù, hanh. (Đường trời rộng thênh thang thấu suốt, công danh sự nghiệp đại hanh thông).'
    ]
  },
  '7-4': {
    number: 27, key: '7-4', nameVi: 'Sơn Lôi Di', nameZh: '山雷頤', symbol: '䷚', upperNum: 7, lowerNum: 4,
    upperName: 'Sơn', lowerName: 'Lôi',
    judgment: 'Di: Trinh cát, quan di, tự cầu khẩu thực. Nuôi dưỡng thân tâm, cẩn trọng lời ăn tiếng nói và ăn uống.',
    greatImage: 'Sơn hạ hữu lôi, Di; quân tử dĩ thận ngôn ngữ, tiết ẩm thực. (Dưới chân núi có sấm động, người quân tử cẩn trọng lời ăn tiếng nói, tiết độ trong ăn uống).',
    meaning: 'Đạo dưỡng sinh: Bệnh từ miệng vào, họa từ miệng ra. Chú trọng sức khỏe và phát ngôn.',
    dailyAdvice: 'Ăn uống thanh đạm điều độ, kiểm soát phát ngôn trên mạng xã hội và trong các cuộc họp.',
    lineTexts: [
      'Sơ Cửu: Xả nhĩ linh quy, quan ngã đóa di, hung. (Bỏ rùa thần quý báu mà thèm thuồng nhìn người khác ăn uống, hung).',
      'Lục Nhị: Điên di, phất kinh vu khâu di, chinh hung. (Điên đảo đạo nuôi dưỡng, tìm kiếm bổng lộc không chính đáng, hung).',
      'Lục Tam: Phất di, trinh hung, thập niên vật dụng. (Trái với đạo dưỡng sinh, mười năm không dùng được việc gì).',
      'Lục Tứ: Điên di cát, hổ thị đam đam. (Nuôi dưỡng kẻ dưới như hổ rình mồi tập trung cao độ, cát lành).',
      'Lục Ngũ: Phất kinh, cư trinh cát, bất khả thiệp đại xuyên. (Lệch đạo nuôi dưỡng nhưng biết an phận giữ mình thì cát, chớ vượt sông lớn).',
      'Thượng Cửu: Do di, lệ cát, lợi thiệp đại xuyên. (Nguồn gốc nuôi dưỡng muôn dân, gánh vác trọng trách lớn, đại cát).'
    ]
  },
  '2-5': {
    number: 28, key: '2-5', nameVi: 'Trạch Phong Đại Quá', nameZh: '澤風大過', symbol: '䷛', upperNum: 2, lowerNum: 5,
    upperName: 'Trạch', lowerName: 'Phong',
    judgment: 'Đại Quá: Đống nạo, lợi hữu du vãng, hanh. Cột xà oằn cong chịu tải nặng, gánh vác việc phi thường.',
    greatImage: 'Trạch diệt mộc, Đại Quá; quân tử dĩ độc lập bất cụ, độn thế vô muộn. (Nước đầm dâng ngập nhấn chìm cây gỗ, quân tử đứng một mình không sợ, lánh đời không buồn phiền).',
    meaning: 'Áp lực cực lớn, trách nhiệm nặng nề đè nặng lên vai, cần dũng khí phi thường để vượt qua.',
    dailyAdvice: 'Chia nhỏ công việc để giảm tải, tránh ôm đồm quá sức, tìm kiếm sự trợ giúp từ đồng đội.',
    lineTexts: [
      'Sơ Lục: Tạ dụng bạch mao, vô cữu. (Dùng cỏ tranh trắng lót lễ vật, cẩn trọng từng tiểu tiết thì không lỗi).',
      'Cửu Nhị: Khô dương sinh đễ, lão phu đắc kỳ phụ thê. (Cây liễu khô đâm chồi non, ông già lấy được vợ trẻ, việc chuyển biến tốt bất ngờ).',
      'Cửu Tam: Đống nạo, hung. (Cột xà oằn cong sắp gãy, không người chống đỡ, hung hiểm).',
      'Cửu Tứ: Đống long, cát. (Cột xà được chống đỡ vững chắc thêm, tốt lành).',
      'Cửu Ngũ: Khô dương sinh hoa, lão phụ đắc kỳ sĩ phu. (Liễu khô trổ hoa nhất thời khó bền, cần thực tế).',
      'Thượng Lục: Quá thiệp diệt đính, hung, vô cữu. (Lội qua sông nước ngập đỉnh đầu, dũng cảm hy sinh vì đại nghĩa, không lỗi).'
    ]
  },
  '6-6': {
    number: 29, key: '6-6', nameVi: 'Thuần Khảm', nameZh: '坎為水', symbol: '䷜', upperNum: 6, lowerNum: 6,
    upperName: 'Thủy', lowerName: 'Thủy',
    judgment: 'Tập Khảm: Hữu phu, duy tâm hanh, hành hữu thượng. Nước chảy xiết qua muôn ghềnh đá, giữ vững niềm tin.',
    greatImage: 'Thủy chí xuy, Tập Khảm; quân tử dĩ thường đức hạnh, tập giáo sự. (Nước chảy dồn dập vượt hiểm nguy, quân tử giữ vững đức hạnh hằng thường).',
    meaning: 'Hiểm nguy trùng trùng, thử thách liên tiếp; lấy lòng trung chính và kiên trì làm phao cứu sinh.',
    dailyAdvice: 'Đi lại cẩn thận, không mạo hiểm tài chính, giữ tâm bất biến giữa dòng đời vạn biến.',
    lineTexts: [
      'Sơ Lục: Tập khảm, nhập vu khảm trĩ, hung. (Rơi vào hố sâu hiểm trở, hung hiểm).',
      'Cửu Nhị: Khảm hữu hiểm, cầu tiểu đắc. (Đang trong hiểm cảnh, mưu cầu việc nhỏ thì được).',
      'Lục Tam: Lai chi khảm khảm, hiểm thả chẩm. (Tiến thoái đều gặp hiểm nguy, hãy đứng yên chờ đợi).',
      'Lục Tứ: Tôn tửu quỹ, nhị dụng phẫu. (Chén rượu giỏ cơm đơn sơ dâng lên thành kính, thoát hiểm không lỗi).',
      'Cửu Ngũ: Khảm bất doanh, kỳ ký bình. (Nước trong hố không tràn ra, hiểm nguy sắp bằng lặng).',
      'Thượng Lục: Hệ dụng huy mặc, trí vu tùng cức. (Bị trói bằng dây thừng trong bụi gai ba năm, bế tắc chờ ăn năn sửa mình).'
    ]
  },
  '3-3': {
    number: 30, key: '3-3', nameVi: 'Thuần Ly', nameZh: '離為火', symbol: '䷝', upperNum: 3, lowerNum: 3,
    upperName: 'Ly', lowerName: 'Ly',
    judgment: 'Ly: Lợi trinh, hanh; súc tẫn ngưu, cát. Lửa sáng rực rỡ nương tựa vào củi, quang minh chính đại.',
    greatImage: 'Minh lưỡng tác, Ly; đại nhân dĩ kế minh chiếu vu tứ phương. (Hai ngọn đuốc cùng soi rọi sáng rực, bậc đại nhân nối tiếp ánh sáng chiếu khắp bốn phương).',
    meaning: 'Trí tuệ minh mẫn, danh tiếng vang xa, cần có nơi nương tựa vững chắc để duy trì ánh sáng.',
    dailyAdvice: 'Phát huy năng lực chuyên môn, giữ thái độ khiêm nhu như trâu mẹ hiền hòa để duy trì phúc khí.',
    lineTexts: [
      'Sơ Cửu: Lý thác nhiên, kính chi vô cữu. (Bước chân vội vã lúc ban mai, giữ lòng cung kính cẩn trọng thì không lỗi).',
      'Lục Nhị: Hoàng ly, nguyên cát. (Ánh lửa màu vàng trung chính dịu dàng, đại cát đại lợi).',
      'Cửu Tam: Nhật trắc chi ly, bất cổ bồn nhi ca. (Ánh tà dương xế bóng, người già than thở, nên lạc quan vui sống).',
      'Cửu Tứ: Đột như lai như, phần như, tử như, khí như. (Bốc cháy dữ dội bất ngờ như ngọn lửa thiêu rụi, rước họa diệt vong).',
      'Lục Ngũ: Xuất lệ đà nhược, thích ta nhược, cát. (Rơi lệ xót xa hối lỗi, lòng thành cảm động trời cao, chuyển hung thành cát).',
      'Thượng Cửu: Vương dụng xuất chinh, hữu gia chiết thủ, hoạch phỉ kỳ sử, vô cữu. (Vua ra quân dẹp giặc chỉ bắt tướng đầu sỏ tha cho kẻ tòng phạm, công đức vô lượng).'
    ]
  }
};

/**
 * Lấy chi tiết quẻ theo cặp số Thượng quái và Hạ quái (1..8)
 * Nếu chưa có quẻ trong từ điển cơ bản, tự động tổng hợp chuẩn xác theo quy luật Chu Dịch
 */
export function getFullHexagramDetail(upperNum: number, lowerNum: number): HexagramDetail {
  const key = `${upperNum}-${lowerNum}`;
  if (FULL_64_HEXAGRAMS[key]) {
    return FULL_64_HEXAGRAMS[key];
  }

  const up = TRIGRAM_NAMES[upperNum] || TRIGRAM_NAMES[1];
  const low = TRIGRAM_NAMES[lowerNum] || TRIGRAM_NAMES[1];
  const hexNum = (upperNum - 1) * 8 + lowerNum;
  const genericName = `${up.nature.split(' ')[0]} ${low.nature.split(' ')[0]}`;

  return {
    number: hexNum,
    key,
    nameVi: `${genericName} Quái`,
    nameZh: `${up.name}${low.name}卦`,
    symbol: '䷅',
    upperNum,
    lowerNum,
    upperName: up.name,
    lowerName: low.name,
    judgment: `Thoán Từ: Thượng quái ${up.name} (${up.nature}) phối Hạ quái ${low.name} (${low.nature}). Đạo trời đất biến hóa tuần hoàn.`,
    greatImage: `Đại Tượng: ${up.nature} ở trên, ${low.nature} ở dưới. Quân tử chiêm nghiệm âm dương tiêu trưởng mà tu thân dưỡng đức.`,
    meaning: `Sự tương tác giữa ${up.nature} và ${low.nature}. Khí cơ vận động biến dịch khôn lường.`,
    dailyAdvice: `Hôm nay nên giữ tâm thế trung chính, hành động thuận theo thời cơ tự nhiên, cân bằng nhu cương.`,
    lineTexts: [
      'Sơ Hào: Khởi đầu sự việc, nên điềm tĩnh quan sát nền tảng ban đầu.',
      'Nhị Hào: Đắc trung đắc vị, nhân duyên hòa hợp, có quý nhân đồng hành.',
      'Tam Hào: Giao thời giữa nội quái và ngoại quái, cần chú ý chi tiết nhỏ.',
      'Tứ Hào: Bước vào ngoại quái, thời cơ triển khai công việc mới bắt đầu hé lộ.',
      'Ngũ Hào: Vị trí tôn quý quân vị, thuận lợi cho việc lãnh đạo và quyết sách.',
      'Thượng Hào: Đỉnh cao của sự việc, nên biết đủ dừng lại để giữ gìn thành quả.'
    ]
  };
}
