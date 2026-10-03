import test from 'node:test';
import assert from 'node:assert/strict';

// Lightweight DOM fixture: exercises actual app handlers without a browser dependency.
class Element {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attributes={};this.dataset={};this.hidden=false;this.value='';this.textContent='';}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;}
 setAttribute(key,value){this.attributes[key]=value;}
 get text(){return this.textContent+this.children.map(x=>x.text).join(' ');}
}
const walk=(node)=>[node,...node.children.flatMap(walk)];
test('app switches days and rain timeline, persists checklist and recalculates budget',async()=>{
 const ids=['party','bookings','sources','days','itinerary','rain','plan','info','check','budget','check-progress','checks','total','thb','remaining','fx','limit','expenses','export','connection','storage-status'];
 const nodes=Object.fromEntries(ids.map(id=>[id,new Element()]));
 const tabs=['plan','info','check','budget'].map(view=>{const e=new Element('button');e.dataset.view=view;return e;});
 const memory=new Map();
 const originals=Object.fromEntries(['document','window','navigator'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:id=>nodes[id],createElement:tag=>new Element(tag),querySelectorAll:()=>tabs}});
 Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},addEventListener(){}}});
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:true}});
 try {
  await import('../src/app.js');
  assert.equal(nodes.days.children.length,5);
  assert.match(nodes.itinerary.text,/ถึงไทเป/);
  nodes.days.children[1].onclick();
  assert.match(nodes.itinerary.text,/Longshan Temple/);
  nodes.rain.onclick();
  assert.match(nodes.itinerary.text,/เช้าช้า ๆ ใน Ximen/);
  // Original outdoor stop is removed, rather than merely adding a rain note.
  assert.ok(!walk(nodes.itinerary).some(e=>e.tagName==='h3'&&e.textContent==='Longshan Temple'));
  nodes.days.children[4].onclick();
  assert.match(nodes.itinerary.text,/เดินทางกลับ BKK/);
  tabs[1].onclick();assert.equal(nodes.info.hidden,false);assert.equal(nodes.plan.hidden,true);
  const check=nodes.checks.children[0].children[0];check.checked=true;check.onchange();
  assert.match(nodes['check-progress'].textContent,/1 \/ 12/);
  const expense=nodes.expenses.children[1];expense.value='200';expense.oninput();
  nodes.fx.value='1.1';nodes.fx.oninput();
  assert.equal(nodes.total.textContent,'NT$ 200');assert.match(nodes.thb.textContent,/220/);
  const saved=JSON.parse([...memory.values()][0]);
  assert.equal(saved.checks[0],true);assert.equal(saved.expenses['2026-10-10'],'200');assert.equal(saved.rain,true);
 } finally {for(const [key,descriptor] of Object.entries(originals)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});
