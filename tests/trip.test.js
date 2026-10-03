import test from 'node:test';
import assert from 'node:assert/strict';
import {trip} from '../src/trip.js';
import {initialDay,totals,load,save} from '../src/state.js';
test('auto day respects Taipei midnight rather than browser timezone',()=>{
 assert.equal(initialDay(trip.days,new Date('2026-10-10T16:00:00Z')),'2026-10-11');
 assert.equal(initialDay(trip.days,new Date('2026-10-02T00:00:00Z')),'2026-10-10');
 assert.equal(initialDay(trip.days,new Date('2026-10-20T00:00:00Z')),'2026-10-14');
});
test('expenses ignore negative and invalid amounts and show overspend',()=>{
 assert.deepEqual(totals({a:'200',b:'50.5',c:-10,d:'x'},1.08,100),{total:250.5,thb:270.54,remaining:-150.5});
});
test('corrupt or blocked storage does not break app',()=>{
 const fallback={day:'2026-10-10'};
 assert.deepEqual(load({getItem:()=>'{bad'},fallback),fallback);
 assert.equal(save({setItem(){throw Error('quota');}},{}),false);
});
