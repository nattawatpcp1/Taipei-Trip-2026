import {trip} from './trip.js';
import {initialDay,load,save,totals} from './state.js';
const $ = id => document.getElementById(id);
let storage; try {storage=window.localStorage;} catch {storage={getItem:()=>null,setItem:()=>{throw Error('unavailable');}};}
const state=load(storage,{day:initialDay(trip.days),rain:false,checks:{},expenses:{},fx:'',limit:''});
if (!trip.days.some(d=>d.id===state.day)) state.day=initialDay(trip.days);
for (const field of ['checks','expenses']) if (!state[field] || typeof state[field]!=='object' || Array.isArray(state[field])) state[field]={};
state.rain=state.rain===true;
const persist=()=>{$('storage-status').textContent=save(storage,state)?'บันทึกในเครื่องแล้ว':'เบราว์เซอร์ไม่อนุญาตให้บันทึก กรุณาดาวน์โหลดข้อมูลสำรองก่อนปิดหน้า';};
function el(tag,text,className) {const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(className)n.className=className; return n;}
function mapLink(query) {const a=el('a','เปิด Maps ↗','map');a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);a.target='_blank';a.rel='noopener noreferrer';return a;}
$('party').textContent=trip.party;
function renderPlan(){
  $('days').replaceChildren();
  trip.days.forEach((d,i)=>{const b=el('button');b.append(el('small','DAY '+(i+1)),el('b',d.id.slice(8)+' ต.ค.'));b.setAttribute('aria-pressed',String(state.day===d.id));b.onclick=()=>{state.day=d.id;persist();renderPlan();};$('days').append(b);});
  const d=trip.days.find(d=>d.id===state.day), panel=$('itinerary');panel.replaceChildren();
  $('rain').setAttribute('aria-pressed',String(state.rain));$('rain').textContent=state.rain?'☂ แผนฝนตกเปิดอยู่':'☂ ใช้แผนฝนตก';
  const head=el('div',undefined,'day-head');head.append(el('p',d.area,'eyebrow'),el('h2',d.title));panel.append(head);
  const family=el('div',undefined,'family');family.append(el('b','พักได้เสมอ'),el('p',d.kid));panel.append(family);
  if(state.rain){const r=el('div',undefined,'card rain-card');r.append(el('h3','แผนสำรองเมื่อฝนตก'),el('p',d.rain),el('small','ตรวจพยากรณ์และประกาศผู้ให้บริการก่อนปรับแผน ไม่มีข้อมูลอากาศสดในแอป'));panel.append(r);}
  const timeline=el('div',undefined,'timeline');
  timeline.append(el('p',state.rain?'เส้นทางเดิมสำหรับอ้างอิง — ใช้แผนสำรองด้านบนเมื่อฝนตก':'กรอบเวลาโดยประมาณ ปรับตามพลังเด็กและการเดินทาง','muted'));
  d.stops.forEach(s=>{const c=el('article',undefined,'stop');const detail=el('div');detail.append(el('h3',s.title),el('p',s.note));if(s.map)detail.append(mapLink(s.map));c.append(el('span',s.time,'time'),detail);timeline.append(c);});panel.append(timeline);
}
$('rain').onclick=()=>{state.rain=!state.rain;persist();renderPlan();};renderPlan();
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(x=>{const active=x===b;x.setAttribute('aria-pressed',String(active));$(x.dataset.view).hidden=!active;});});
function progress(){$('check-progress').textContent=trip.checklist.filter((_,i)=>state.checks[i]===true).length+' / '+trip.checklist.length+' รายการพร้อมแล้ว';}
trip.checklist.forEach((text,i)=>{const l=el('label',undefined,'check-row'),input=el('input');input.type='checkbox';input.checked=state.checks[i]===true;input.onchange=()=>{state.checks[i]=input.checked;persist();progress();};l.append(input,el('span',text));$('checks').append(l);});progress();
function calc(){const t=totals(state.expenses,state.fx,state.limit),fmt=n=>n.toLocaleString('th-TH',{maximumFractionDigits:2});$('total').textContent='NT$ '+fmt(t.total);$('thb').textContent=Number(state.fx)>0?'ประมาณ ฿ '+fmt(t.thb):'ใส่อัตราแลกเปลี่ยนเพื่อแสดงเงินบาท';$('remaining').textContent=state.limit!==''?'งบคงเหลือ NT$ '+fmt(t.remaining):'ยังไม่ได้กำหนดงบรวม';}
for(const id of ['fx','limit']){$(id).value=state[id];$(id).oninput=()=>{state[id]=$(id).value;persist();calc();};}
trip.days.forEach((d,i)=>{const label=el('label','Day '+(i+1)+' · '+d.id.slice(8)+' ต.ค.');const input=el('input');input.type='number';input.min='0';input.step='0.01';input.placeholder='NT$';input.id='expense-'+d.id;label.htmlFor=input.id;input.value=state.expenses[d.id]??'';input.oninput=()=>{state.expenses[d.id]=input.value;persist();calc();};$('expenses').append(label,input);});calc();
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:trip.version,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='taipei-trip-v5.4-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
let offlineReady=false;
function connection(){$('connection').textContent=navigator.onLine?(offlineReady?'พร้อมเปิดซ้ำแบบออฟไลน์ • Maps ต้องใช้อินเทอร์เน็ต':'ออนไลน์ • กำลังเตรียมข้อมูลออฟไลน์'):'ออฟไลน์ • แสดงข้อมูลที่เคยบันทึกไว้';}
window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
if('serviceWorker' in navigator){navigator.serviceWorker.register(new URL('../sw.js',import.meta.url)).then(async()=>{await navigator.serviceWorker.ready;offlineReady=true;connection();}).catch(()=>{$('connection').textContent='ออนไลน์ • ยังเตรียมออฟไลน์ไม่สำเร็จ ลองโหลดหน้าใหม่';});}else $('connection').textContent='เบราว์เซอร์นี้ไม่รองรับการเปิดซ้ำแบบออฟไลน์';
