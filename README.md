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

## 📂 Cấu trúc thư mục  

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

## 👥 Đóng góp & Liên hệ
Chào đón mọi pull request & issue!

Eng
# CIMO-TOOL-SOCIAL
chedule and automatically post short videos to multiple social media platforms.


## 🧩 Goal
Automate the entire process from editing, scheduling, to posting videos on TikTok, YouTube, Facebook, etc. Helps save time and ensures posting at the golden hour.

## ✨ Key Features
Internal Video Editing (IPC)
– Files like ipcEditvideo.js handle intro/outro merging, watermark, subtitles.
– Multi-thread architecture: separate processes for editing (ipcEditvideo), file handling (ipcFile), and uploading (ipcTiktok, ipcFB, ipcYT).

## Video Posting Scheduler
– cron.js & cronYT.js use cron to periodically trigger the posting process according to the set schedule.

## Automatic Posting to Multiple Platforms
– Directly interacts with platforms via ipcTiktok.js, ipcFB.js, ipcYT.js.
– Uses Electron (preload.js, main.js) to run a headless browser and perform automated posting actions.

## User Interface
– index.html, login.html, null.html provide a basic UI to configure accounts, view progress, and log in.

## 📂 Folder Structure

.
├── components/         # UI components (if any)  
├── helper/             # Common helper functions  
├── static/             # Static assets (css, js...)
├── cron.js             # Main scheduler
├── cronYT.js           # YouTube-specific scheduler
├── ipcEditvideo.js     # Video editing (cut, watermark, etc.)
├── ipcFile.js          # File/video processing  
├── ipcTiktok.js        # Upload to TikTok  
├── ipcFB.js            # Upload to Facebook  
├── ipcYT.js            # Upload to YouTube  
├── ipcUser.js          # Account management  
├── main.js             # Electron entry point 
├── preload.js          # Bridge between renderer and main process  
├── index.html          # Main UI    
├── login.html          # Login form  
├── null.html           # Auxiliary page
├── package.json        # Metadata & dependencies  
└── webpack.config.js   # Frontend build configuration  

## 🛠 Installation & Run
### Clone the project:

``` git clone https://github.com/LilyRisa/CIMO-TOOL-SOCIAL.git```
```cd CIMO-TOOL-SOCIAL```
### Install dependencies:
```npm install```

### Run in development mode:


```npm run start```

### Or, if you use Electron:

```npm run electron```


## Account Setup & Scheduling

– Open login.html UI and log into your social media account.
– Configure the schedule in cron.js using the desired cron schedule.
– Set the folder containing original videos and configure editing options in the UI or config file.

## 📌 Tips & Notes
– Ensure the source videos exist and are in supported formats (mp4, mov, etc.).
– IPC scripts run independently, making it easy to debug each step (edit → file → upload).
– For platforms without a public API, Electron + web interaction ensures automated posting.
– Can integrate proxy or multi-account support via ipcUser.js if needed.

## 🚧 Future Development
– Support additional platforms: Instagram Reels, LinkedIn, etc.
– Performance optimization: batch process videos in parallel, leverage GPU acceleration.
– Advanced management UI: display posted schedules, edit schedules directly, detailed logs.

## 👥 ĐContribution & Contact
Pull requests & issues are welcome!


Author: LilyRisa

Github: LilyRisa/CIMO-TOOL-SOCIAL

Email: support@cimo.vn

ads: [CIMO - MỌI THỨ BẠN CẦN VỚI MỨC GIÁ TỐT NHẤT](https://cimo.vn)


