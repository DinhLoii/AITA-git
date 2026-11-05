# Mộc Space — FER202

Ứng dụng React 19 + Vite 6 với giao diện xanh rừng, kem và vàng nhạt. Thiết kế thích ứng desktop/mobile; không phụ thuộc font hay hình ảnh bên ngoài.

## Chạy và deploy

Node.js 20.19 trở lên:

```sh
npm ci
npm run dev
npm run build
```

Vercel: Framework Vite, Root Directory `./`, Build `npm run build`, Output `dist`. Không cần biến môi trường hay backend.

## Chức năng

- `/#login`: đăng nhập, thông báo lỗi chung khi sai thông tin.
- `/#register`: đăng ký, kiểm tra họ tên/email/mật khẩu/xác nhận và chặn email trùng.
- `/#dashboard`: trang cá nhân được bảo vệ, đăng xuất và giữ phiên qua tải lại cùng tab.
- Tài khoản dùng localStorage, phiên dùng sessionStorage. Không tạo tài khoản mặc định.
- Giữ nguyên các data-testid của đề FER202 để chạy TC01–TC13.
- Mật khẩu dùng salt ngẫu nhiên + PBKDF2, không lưu dạng rõ. Đây là mô phỏng frontend cho học tập, chỉ dùng thông tin thử.

Chạy qua localhost hoặc HTTPS để sử dụng Web Crypto. Đóng tab sẽ kết thúc phiên; đăng ký vẫn được lưu trên trình duyệt đó.
