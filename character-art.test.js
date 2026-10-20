import test from 'node:test';
import assert from 'node:assert/strict';
import { ANCESTRIES, GENDERS, AGES, artworkFor, normalizeAppearance } from './character-art.js';
test('all 54 ancestry, gender and age combinations have distinct atlas selections',()=>{
 const choices=new Set();
 for(const ancestry of ANCESTRIES)for(const gender of GENDERS)for(const age of AGES){
  const art=artworkFor({ancestry,gender,age});choices.add(`${art.url}:${art.x}:${art.y}`);
  assert.match(art.label,new RegExp(ancestry));
 }
 assert.equal(choices.size,54);
});
test('halfling artwork never uses the human atlas',()=>{
 assert.equal(artworkFor({ancestry:'Halfling',age:'Teen',gender:'Male'}).url,'assets/characters/halfling.png');
 assert.notEqual(artworkFor({ancestry:'Human'}).url,artworkFor({ancestry:'Halfling'}).url);
});
test('old characters gain a valid age and gender without changing valid ancestry',()=>{
 assert.deepEqual(normalizeAppearance({ancestry:'Dwarf',gender:'Male'}),{ancestry:'Dwarf',gender:'Male',age:'Adult'});
 assert.equal(normalizeAppearance({gender:' male '}).gender,'Male');
 assert.deepEqual(normalizeAppearance({ancestry:'Elf',gender:'legacy free text'}),{ancestry:'Elf',gender:'Female',age:'Adult'});
});

test('every ancestry atlas is present and uses the expected 2 by 3 layout', async()=>{
 const { readFile }=await import('node:fs/promises');
 for(const ancestry of ANCESTRIES){
  const image=await readFile(new URL(artworkFor({ancestry}).url,import.meta.url));
  assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(image.readUInt32BE(16)*3,image.readUInt32BE(20)*2,`${ancestry} atlas must have square cells`);
 }
});
