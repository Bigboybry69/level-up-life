import test from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, dayXP, progress, distance, streak } from './progress.js';
test('daily total awards movement once, and check-in awards 50 XP',()=>{const days={'2026-01-01':{steps:2000,checkin:true}};assert.equal(dayXP(days['2026-01-01']),150);days['2026-01-01'].steps=2100;assert.equal(progress(days).xp,155);});
test('level boundaries roll over at 500 XP',()=>{assert.deepEqual(progress({a:{steps:10000}}),{xp:500,level:2,current:0});assert.equal(progress({}).level,1);});
test('streak tolerates an unfinished today and breaks at a missed day',()=>{const days={'2026-01-02':{steps:100},'2026-01-01':{checkin:true}};assert.equal(streak(days,new Date(2026,0,3)),2);assert.equal(streak(days,new Date(2026,0,4)),0);});
test('distance supports check-in radius and walking distances',()=>{assert.equal(distance({latitude:0,longitude:0},{latitude:0,longitude:0}),0);assert.ok(Math.abs(distance({latitude:0,longitude:0},{latitude:.001,longitude:0})-111.195)<1);});
test('date keys use the local calendar',()=>assert.equal(dayKey(new Date(2026,0,2,23,59)),'2026-01-02'));
