# AEVN Command Dashboard

Ứng dụng web quản lý và phân tích chỉ số sự kiện cho Quân đoàn AEVN. Dashboard giúp Ban Quản Trị theo dõi sức mạnh tổng thể, tra cứu thành viên, cập nhật chỉ số nhanh và gợi ý đội hình đánh Event theo hệ Boss/đối thủ.

## Tổng quan website

Website gồm 4 khu vực chính:

- **Tổng quan quân đoàn**: hiển thị KPI tổng số thành viên, trung bình Cột 1, top lực chiến, tổng công/máu quân bị; kèm biểu đồ phân phối sức mạnh và radar chỉ số Kháng/Diệt trung bình.
- **Danh sách thành viên**: bảng dữ liệu đầy đủ các trường chỉ số, hỗ trợ tìm kiếm theo ID game/Tên Zalo/Tên Game, gợi ý autocomplete, lọc theo khoảng Cột 1, Công/Máu, lọc chỉ số Kháng/Diệt vượt ngưỡng, sort từng cột, phân trang, thêm/sửa thành viên và export Excel.
- **Chi tiết thành viên**: hồ sơ năng lực từng người, gồm thông tin cá nhân, phân tích Ngọc/Lỗ bằng progress bar, biểu đồ so sánh Kháng vs Diệt theo 4 hệ Thục/Ngô/Ngụy/Quần.
- **Hỗ trợ xếp đội hình Event**: chọn hệ Boss/đối thủ, hệ thống tự chấm điểm đề xuất đội hình dựa trên Diệt, Kháng và Cột 1; hỗ trợ copy danh sách hoặc xuất file text để thông báo lên nhóm.

Giao diện dùng dark mode, tối ưu responsive cho desktop và mobile, dùng các màu đỏ/vàng/tím/xanh làm điểm nhấn cho dữ liệu game.

## Công nghệ

- Angular 22 standalone application
- TypeScript
- Chart.js cho biểu đồ cột và radar
- Firebase Web SDK
- Firebase Authentication anonymous sign-in
- Cloud Firestore cho dữ liệu `members`
- Local/sample fallback để dashboard vẫn chạy khi Firestore chưa có dữ liệu hoặc chưa kết nối được

## Source chính

- `src/app/app.ts`: logic chính của dashboard, tính KPI, filter, sort, pagination, profile, matchmaking, export và render biểu đồ.
- `src/app/app.html`: template giao diện 4 trang.
- `src/styles.css`: toàn bộ layout, dark theme, responsive UI.
- `src/app/member.model.ts`: kiểu dữ liệu thành viên, hệ và các field số.
- `src/app/member-data.service.ts`: đọc/ghi Firestore, dữ liệu mẫu và fallback localStorage.
- `src/app/firebase.ts`: cấu hình Firebase, Firestore, Auth và Analytics.
- `firestore.rules`: prototype Security Rules cho collection `members`.
- `firestore-security-analysis.md`: ghi chú schema, query, access pattern và audit rules.
- `task.md`: yêu cầu nghiệp vụ gốc.

## Chạy local

```bash
npm install
npm start
```

Mặc định Angular serve ở `http://localhost:4200/`. Nếu port 4200 đang bận, Angular có thể được chạy với port khác:

```bash
npm start -- --host 127.0.0.1 --port 4201
```

## Build và test

```bash
npm run build
npm test -- --watch=false
```

## Firestore

App dùng collection `members`. Khi Firestore trống hoặc chưa kết nối được, ứng dụng tự hiển thị dữ liệu mẫu để có thể thao tác thử ngay.

Kiểm tra cú pháp rules:

```bash
npx -y firebase-tools@latest deploy --only firestore:rules --dry-run
```

Rules hiện tại là bản prototype cho môi trường nội bộ/thử nghiệm: yêu cầu người dùng đã authenticated và validate schema dữ liệu chặt chẽ, nhưng chưa có mô hình phân quyền BQT bằng custom claims hoặc admin allowlist.

