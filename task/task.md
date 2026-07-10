# Pre
- Task ban đầu là task-init.md
- Các task change request thay đổi theo cấu trúc task-{{number}} với number tăng dần đại diện cho lịch sử thay đổi yêu cầu.
- Mỗi khi thực thi xong task thì tự động tạo file task-{{number}} để lưu trữ lịch sử change request.
- Sau khi thực thi xong tự động test và deploy lên https://dctq-69844.web.app/.

# Task
Hãy xây dựng một ứng dụng web (Dashboard) Quản lý và Phân tích Chỉ số Sự kiện cho Quân Đoàn AEVN dựa trên cấu trúc dữ liệu dưới đây. Hệ thống cần được thiết kế hiện đại, responsive, trực quan hóa dữ liệu bằng biểu đồ và hỗ trợ bộ lọc thông minh.

[CẤU TRÚC DỮ LIỆU ĐẦU VÀO]
Các trường thông tin cần quản lý và hiển thị:
- Thông tin cơ bản: Dấu thời gian, Tên Zalo, Tên trong Game, ID game.
- Chỉ số Ngọc/Lỗ: Lỗ vàng giới hạn, Lỗ tím giới hạn, Lỗ vàng thường, Lỗ tím thường.
- Chỉ số Quân bị: Chỉ số máu trong Quân bị, Chỉ số công trong Quân bị.
- Chỉ số Kháng (Phòng thủ): Kháng thục, Kháng ngô, Kháng ngụy, Kháng quần.
- Chỉ số Diệt (Tấn công): Diệt thục, Diệt ngô, Diệt ngụy, Diệt quần.
- Chỉ số tổng hợp: Cột 1 (Điểm lực chiến/Điểm tổng hợp quy đổi).

[YÊU CẦU THIẾT KẾ GIAO DIỆN & CÁC TRANG (PAGES)]
Ứng dụng gồm có 4 trang chính với các chức năng chi tiết sau:

1. PAGE 1: TỔNG QUAN QUÂN ĐOÀN (DASHBOARD)
* Mục đích: Giúp Ban Quản Trị (BQT) có cái nhìn toàn diện về sức mạnh tổng thể của Quân đoàn trước khi xếp đội hình sự kiện.
* Chức năng & Thành phần:
  - Khối thẻ số liệu (KPI Cards): Hiển thị tổng số thành viên đã đăng ký, Trung bình Điểm tổng hợp (Cột 1), Top lực chiến cao nhất, Tổng điểm công/máu quân bị toàn quân đoàn.
  - Biểu đồ 1 (Xu hướng sức mạnh): Biểu đồ cột phân phối số lượng thành viên theo các khoảng Điểm tổng hợp (ví dụ: <300, 300-400, >400) để biết quân đoàn mạnh đều hay lệch.
  - Biểu đồ 2 (Radar Chart - Chỉ số hệ thống trung bình): Hiển thị mạng nhện trung bình của 4 chỉ số Kháng (Thục-Ngô-Ngụy-Quần) và 4 chỉ số Diệt để đánh giá thiên hướng chiến thuật chung của Quân đoàn (ví dụ: Quân đoàn đang mạnh về Diệt Ngô hay Kháng Thục).
  - Bảng xếp hạng nhanh (Top 5 Lực Chiến): Hiển thị 5 thành viên có "Cột 1" cao nhất.

2. PAGE 2: DANH SÁCH THÀNH VIÊN & BỘ LỌC CHI TIẾT (MEMBER DIRECTORY) * Mục đích: Tra cứu, quản lý dữ liệu thành viên; cho phép tìm kiếm thông minh và cập nhật biến động chỉ số nhanh chóng. * Chức năng & Thành phần: 
- Thanh tra cứu thông minh: Hỗ trợ tìm kiếm nhanh bằng "ID game" hoặc "Tên Zalo". Ô tìm kiếm phải có chức năng gợi ý tự động (Auto-complete/Suggestions) dựa trên các dữ liệu đang có sẵn trong hệ thống khi người dùng bắt đầu gõ ký tự.

- Bộ lọc chỉ số (Filters): Lọc thành viên theo khoảng điểm Lực chiến (Cột 1), Khoảng chỉ số Công/Máu, hoặc lọc theo chỉ số Diệt/Kháng vượt trội (ví dụ: tìm người có Diệt Ngụy > 70). 
- Bảng dữ liệu (Data Table): Hiển thị đầy đủ tất cả các cột dữ liệu. Hỗ trợ phân trang (Pagination), sắp xếp (Sort) tăng/giảm dần theo từng cột chỉ số. 
- Tính năng Thêm mới (Create): Có nút "Thêm thành viên", khi bấm vào sẽ hiện Form/Popup để nhập mới toàn bộ thông tin từ Tên, ID đến các chỉ số Lỗ, Quân bị, Kháng, Diệt. 
- Tính năng Chỉnh sửa & Cập nhật (Edit & Update): Mỗi dòng thành viên trong bảng sẽ có nút "Chỉnh sửa" (Edit). Khi bấm vào sẽ cho phép sửa nhanh các chỉ số (ví dụ thành viên vừa tăng Lực chiến hoặc nâng thêm Ngọc) và lưu lại để cập nhật trực tiếp vào hệ thống. 
- Nút Action khác: Xem chi tiết hồ sơ, Export dữ liệu ra file Excel.

3. PAGE 3: CHI TIẾT THÀNH VIÊN (MEMBER PROFILE)
* Mục đích: Xem hồ sơ năng lực chi tiết của một thành viên khi click từ danh sách.
* Chức năng & Thành phần:
  - Khu vực Thông tin cá nhân: Hiển thị Tên Game, ID, Zalo, Thời gian đăng ký.
  - Phần phân tích chỉ số Ngọc (Lỗ): So sánh trực quan lượng Lỗ giới hạn vs Lỗ thường (Dạng biểu đồ Donut hoặc Progress Bar).
  - Phần phân tích chiến thuật (Tấn công vs Phòng thủ): Biểu đồ cột đôi so sánh trực tiếp Kháng vs Diệt của từng nước (Thục, Ngô, Ngụy, Quần) của riêng người đó, giúp BQT biết thành viên này khắc chế cứng thế lực nào để xếp vào trận đánh phù hợp.

4. PAGE 4: HỖ TRỢ XẾP ĐỘI HÌNH SỰ KIỆN (EVENT MATCHMAKING TOOL)
* Mục đích: Tính năng mở rộng giúp BQT tối ưu hóa đội hình đánh Event.
* Chức năng & Thành phần:
  - Bộ lọc chọn mục tiêu Boss/Đối thủ: Cho phép BQT chọn thế lực của trận đấu sắp tới (ví dụ: Trận này đánh Boss hệ "Thục").
  - Gợi ý đội hình tự động: Hệ thống tự động lọc và đề xuất danh sách các thành viên có chỉ số "Diệt Thục" và "Kháng Thục" cao nhất quân đoàn để đưa vào đội hình tiên phong.
  - Xuất danh sách clone/đội hình chiến thuật ra clipboard hoặc file text để BQT thông báo vào nhóm Zalo.

[YÊU CẦU CÔNG NGHỆ & UI/UX]
- Giao diện: Dark mode sang trọng phù hợp cho game thủ, hoặc Clean Light mode. Sử dụng các tone màu đỏ/vàng/tím làm điểm nhấn tương ứng với các chỉ số ngọc trong game.
- Sử dụng các thư viện biểu đồ tốt (như Recharts, Chart.js hoặc ApexCharts).