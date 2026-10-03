# v5.4 implementation handoff

## จุดตั้งต้นที่ตรวจจริง

clone จาก https://github.com/nattawatpcp1/Taipei-Trip-2026 วันที่ 2 ตุลาคม 2026: HEAD `f9f1f47` Initial commit มี README.md เท่านั้น งานใหม่จัดส่งใน branch `feat/v5.4-webapp` สำหรับเปิด Pull Request เข้า main; การ merge และ deploy เป็นขั้นถัดไป

## แหล่งข้อมูล

ใช้เนื้อหาปัจจุบันของ Taipei_Trip_2026_V5_4_preview.html จากไฟล์เดิม ไม่ใช้วัน 9–13 ต.ค. จากแผนที่เก่ากว่า

คงฐาน Ximen / Hotel Midtown Richardson, STARLUX และเส้นทาง 5 วันไว้ แต่ไม่ใช้คำว่า confirmed เพราะไม่ได้เห็น booking. เวลาไปเดิม BKK 13:30 → TPE 18:10, กลับ TPE 13:55 → BKK 16:40 ต่างเป็นเวลาท้องถิ่นของสนามบินนั้น หน้า itinerary ใช้เวลา Asia/Taipei. ควรยืนยันจำนวนผู้เดินทาง อายุเด็ก โรงแรม และเที่ยวบินก่อนล็อกเวอร์ชันสำหรับเดินทาง

ไม่ยกข้อความอีเวนต์พลุ ราคาค่าโดยสาร หรือเวลาเปิดร้านจากไฟล์เก่ามาเป็นข้อเท็จจริงปัจจุบัน ข้อมูลใหม่เพิ่มเป็นกรอบแผนที่แก้ได้ ไม่มี API สดและไม่มี booking integration

## พฤติกรรมที่ทำแล้ว

- เลือกวันอัตโนมัติตาม Asia/Taipei ก่อนทริปแสดงวันแรก หลังทริปแสดงวันสุดท้าย; การเลือกเองจำในเครื่องและมีลำดับเหนือ auto day
- แผนฝนเป็นคำแนะนำที่แสดงเหนือเส้นทางเดิม ไม่สลับการจองรถหรือวันในเบื้องหลัง
- checklist / daily expense / FX / budget จำใน localStorage เฉพาะ origin และอุปกรณ์นี้ ไม่มีระบบสมาชิก
- ไม่ตั้งค่า FX เป็นอัตราจริง ไม่มีงบสมมติที่ดูเหมือนผู้ใช้อนุมัติ
- export JSON สำหรับเก็บสำรอง; ยังไม่มี import UI
- service worker เก็บเฉพาะไฟล์แอปใน scope นี้ รองรับเปิดซ้ำออฟไลน์หลังดาวน์โหลดสำเร็จ; ไม่ cache Maps หรือเว็บภายนอก

## ทดสอบและต่อยอด

`npm test` ตรวจ timezone ข้ามเที่ยงคืน การคำนวณยอด/งบเกิน และกรณี storage เสียหรือถูกบล็อก. `npm run build` สร้าง static artifact

ก่อนใช้งานจริง ควรตรวจมือถือจริงโดยเฉพาะ iOS Add to Home Screen, เปิดแอปหนึ่งครั้งให้ cache สำเร็จ แล้วเปิด airplane mode ทดสอบ. ตรวจลิงก์สถานที่และ booking จริง

แนวทางถัดไป: PNG app icons, import backup พร้อม validate schema, ช่องข้อมูล booking ส่วนตัวที่ไม่ commit ลง Git, ปุ่ม reset ที่ยืนยันก่อนลบ, weather link ไปแหล่งทางการ และแยกตัวเลือกสวนสัตว์/สวนสนุกเมื่อครอบครัวเลือกแล้ว

## นำชุดไฟล์เข้า repo

แตก ZIP แล้วคัดลอกไฟล์ทั้งหมดรวม `.github` และ `.gitignore` ลง root ของ checkout (README ของชุดนี้ขยายจากหัวข้อเดิม)

```sh
git switch -c feat/v5.4-webapp
npm ci
npm test
npm run build
git add index.html src public sw.js scripts tests docs package.json package-lock.json README.md .gitignore .github/workflows/pages.yml
git commit -m "Build Taipei family trip v5.4 web app"
git push -u origin feat/v5.4-webapp
```

เปิด PR เข้า main และตรวจ diff ก่อน merge จากนั้นตั้งค่า Pages ตาม README คำสั่งข้างต้นใช้เมื่อเริ่มจาก ZIP; หากใช้ Pull Request ที่จัดส่งไว้แล้ว ไม่ต้องอัปโหลดซ้ำ
