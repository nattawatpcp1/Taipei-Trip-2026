# Taipei Family Trip 2026 · v5.4

เว็บแอปภาษาไทยสำหรับทริป 10–14 ตุลาคม 2026 ต่อจากแผน `Taipei_Trip_2026_V5_4_preview.html` (อ่าน 2 ต.ค. 2026) ใช้ HTML/CSS/ES modules ไม่มี production dependencies

## ใช้งานในเครื่อง

ต้องมี Node.js 22 ขึ้นไป แล้วรันจากโฟลเดอร์โปรเจกต์:

```sh
npm ci
npm run dev
```

เปิด http://localhost:5173 ใช้ HTTP server เสมอ ไม่เปิด index.html ผ่าน file://

```sh
npm test
npm run build
npm run preview
```

`dist/` คือไฟล์พร้อมโฮสต์ แก้ต้นฉบับใน `src/` แล้ว build ใหม่

## โครงสร้างไฟล์

| ไฟล์ | หน้าที่ |
| --- | --- |
| `index.html` | โครงหน้า ภาษาไทย แท็บและฟอร์มที่เข้าถึงได้ |
| `src/trip.js` | แผน 5 วัน จุดพักเด็ก แผนฝน ลิงก์ Maps และเช็กลิสต์ |
| `src/app.js` | เลือกวัน สลับแผน บันทึกข้อมูล คำนวณงบ และ export JSON |
| `src/state.js` | วันที่ตาม Asia/Taipei, storage และการคำนวณ |
| `src/styles.css` | ธีมสีเขียว/ครีมและ responsive layout |
| `public/manifest.webmanifest` | ข้อมูลสำหรับติดตั้งแอปบนอุปกรณ์ที่รองรับ |
| `public/icon.svg` | ไอคอนเริ่มต้น |
| `sw.js` | เก็บ app shell สำหรับเปิดซ้ำออฟไลน์ |
| `package.json`, `package-lock.json` | คำสั่งรัน build และทดสอบ |
| `scripts/build.mjs`, `scripts/serve.mjs` | build / local development server |
| `tests/trip.test.js` | ทดสอบ timezone, budget และ storage failure |
| `.github/workflows/pages.yml` | ทดสอบและ deploy GitHub Pages เมื่อ push main |
| `.gitignore` | ไม่เก็บ dist และไฟล์ชั่วคราวใน Git |
| `docs/HANDOFF.md` | หลักการข้อมูล ข้อจำกัดและขั้นตอนส่งขึ้น repo |

## แผนรายวัน

- 10 ต.ค.: TPE → Midtown Richardson → Ximending แบบเบา ๆ
- 11 ต.ค.: Longshan → CKS → พัก/งีบ → Xinyi / Pokémon / Taipei 101
- 12 ต.ค.: Yehliu → Shifen → Jiufen ด้วยรถ/ทัวร์
- 13 ต.ค.: Zoo หรือ Children's Park → Daan / Shilin ตามพลังเด็ก
- 14 ต.ค.: อาหารเช้า → check-out → สนามบิน → BKK

เวลาและโรงแรมอ้างอิงจากแผนเดิม ยังไม่ได้ตรวจตั๋วหรือ booking จริง แอปไม่ดึงข้อมูลอากาศ เวลาเปิด หรืออัตราแลกเปลี่ยนสด กิจกรรมบางรายการเป็นตัวเลือก ไม่ใช่การจองแล้ว

## GitHub Pages

1. เพิ่มชุดไฟล์นี้ใน branch สำหรับ review แล้ว merge เข้า `main` ของ `nattawatpcp1/Taipei-Trip-2026`
2. ใน repo เปิด Settings → Pages → Source: **GitHub Actions**
3. เปิด Actions ตรวจ workflow หรือกด Run workflow บน main
4. URL ที่คาดหมาย: https://nattawatpcp1.github.io/Taipei-Trip-2026/ (ยังไม่ได้เผยแพร่จากงานนี้)

แอปใช้ relative URLs รองรับ subpath ของ project Pages. หาก default branch ไม่ใช่ main ให้แก้ trigger ใน workflow ให้ตรงก่อน merge. งานนี้ไม่ต้องใช้ secret หรือ API key

## Offline / PWA

ต้องเปิดผ่าน HTTPS หรือ localhost และรอข้อความ “พร้อมเปิดซ้ำแบบออฟไลน์” ก่อนใช้งานออฟไลน์ Maps ยังต้องใช้อินเทอร์เน็ต การติดตั้งและไอคอน SVG ขึ้นกับเบราว์เซอร์; หากต้องการไอคอน iOS เต็มรูปแบบ เพิ่ม PNG 180/192/512 px และ apple-touch-icon ในรอบต่อไป

หลังเปลี่ยน app shell ให้เพิ่มชื่อ CACHE ใน sw.js เพื่อไม่ให้ข้อมูลเก่าค้าง และปิดทุกหน้าของแอปแล้วเปิดใหม่เพื่อ activate worker รุ่นใหม่

## v5.4.1 — รายละเอียดเดินทาง

เพิ่มเส้นทาง MRT / รถรับส่ง อาหารหลักและสำรอง ช่วงพักงีบ จุดตัดกิจกรรม และรายการเตรียมของแต่ละวัน แผนฝนเปลี่ยนไทม์ไลน์จริงโดยไม่เปลี่ยน booking ของผู้ใช้ เพิ่มแท็บข้อมูลเที่ยวบิน / ที่พัก / ลิงก์ทางการ ตรวจเว็บ 3 ต.ค. 2026 เวลาเที่ยวบินยังมาจากแผนเดิมและต้องเทียบตั๋วจริง

แก้ข้อมูลทริปที่ `src/trip.js` การ์ดรายละเอียดใช้ `transport`, `meals`, `prepare`, `cut`, `rainStops` ส่วนสถานะ localStorage ใช้ key เดิมเพื่อรักษางบและเช็กลิสต์ของผู้ใช้ v5.4.0
