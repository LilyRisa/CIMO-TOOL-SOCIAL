# CIMO-TOOL-SOCIAL
Lập lịch và tự động đăng video ngắn lên nhiều nền tảng mạng xã hội.


## 🧩 Mục tiêu
Tự động hóa quy trình từ chỉnh sửa, lên lịch đến đăng video trên TikTok, YouTube, Facebook... Giúp tiết kiệm thời gian và đảm bảo đăng đúng giờ vàng.

## ✨ Tính năng nổi bật
Chỉnh sửa video nội bộ (IPC)
– Các file như ipcEditvideo.js xử lý ghép intro/outro, watermark, subtitle.
– Kiến trúc đa luồng: riêng biệt giữa chỉnh sửa (ipcEditvideo), xử lý file (ipcFile), và upload (ipcTiktok, ipcFB, ipcYT).

## Lập lịch đăng video
– cron.js & cronYT.js dùng cron để định kỳ gọi quy trình đăng theo lịch.

## Tự động đăng lên nhiều nền tảng
– Tương tác trực tiếp với nền tảng thông qua ipcTiktok.js, ipcFB.js, ipcYT.js.
– Sử dụng Electron (các file preload.js, main.js) để chạy headless browser và thực hiện thao tác đăng tự động.

## Giao diện
– index.html, login.html, null.html cung cấp UI cơ bản để cấu hình tài khoản, xem tiến trình, và login.

##📂 Cấu trúc thư mục
csharp
Sao chép
Chỉnh sửa
.
├── components/         # UI components (nếu có)  
├── helper/             # Hàm hỗ trợ chung  
├── static/             # Tài nguyên tĩnh (css, js...)  
├── cron.js             # Scheduler chính  
├── cronYT.js           # Scheduler dành riêng cho YouTube  
├── ipcEditvideo.js     # Chỉnh sửa video (cắt, watermark…)  
├── ipcFile.js          # Xử lý file/video  
├── ipcTiktok.js        # Upload lên TikTok  
├── ipcFB.js            # Upload lên Facebook  
├── ipcYT.js            # Upload lên YouTube  
├── ipcUser.js          # Quản lý tài khoản  
├── main.js             # Entry point của Electron  
├── preload.js          # Bridge giữa renderer và main process  
├── index.html          # UI chính  
├── login.html          # Form đăng nhập  
├── null.html           # Trang phụ trợ  
├── package.json        # Metadata & dependencies  
└── webpack.config.js   # Cấu hình đóng gói frontend  
## 🛠 Cài đặt & chạy thử
### Clone dự án:

``` git clone https://github.com/LilyRisa/CIMO-TOOL-SOCIAL.git```
```cd CIMO-TOOL-SOCIAL```
### Cài đặt dependencies:
```npm install```

### Chạy chế độ phát triển:


```npm run start```

### hoặc nếu bạn dùng Electron:

```npm run electron```


## Thiết lập tài khoản & lịch đăng:

Mở giao diện login.html, đăng nhập tài khoản mạng xã hội.

Cấu hình lịch trong cron.js theo cron schedule mong muốn.

Đặt folder chứa video gốc và cấu hình edit trong UI hoặc file config.

## 📌 Mẹo & Lưu ý
Đảm bảo video gốc tồn tại và định dạng phù hợp (mp4, mov…).

Các script IPC chạy độc lập, dễ debug từng phần (edit → file → upload).

Với nền tảng không có API công khai, Electron + web interaction đảm bảo đăng tự động.

Có thể tích hợp proxy hoặc đa tài khoản qua ipcUser.js nếu cần.

## 🚧 Hướng phát triển
Hỗ trợ thêm nền tảng: Instagram Reels, LinkedIn,...

Tối ưu hiệu năng: xử lý video hàng loạt song song, sử dụng GPU tăng tốc.

Giao diện quản lý nâng cao: hiển thị lịch đã đăng, chỉnh sửa lịch trực tiếp, log chi tiết.

Tích hợp CI/CD: tự động build, test và deploy.

## 👥 Đóng góp & Liên hệ
Chào đón mọi pull request & issue!

Author: LilyRisa

Github: LilyRisa/CIMO-TOOL-SOCIAL

Email: support@cimo.vn

ads: [CIMO - MỌI THỨ BẠN CẦN VỚI MỨC GIÁ TỐT NHẤT](https://cimo.vn)

