import test from 'node:test';
import assert from 'node:assert/strict';
import {ABILITIES,CLASS_PRIORITIES,STANDARD_ARRAY,generateAbilities,validAbilities,abilitiesFor,modifier} from './abilities.js';
test('every class always uses the standard array and honors its chosen priorities',()=>{
 for(const name of Object.keys(CLASS_PRIORITIES))for(let i=0;i<150;i++){
  const value=generateAbilities(name);assert.equal(validAbilities(value,name),true);
  assert.deepEqual(Object.values(value.scores).sort((a,b)=>b-a),STANDARD_ARRAY);
  [...value.primary,value.secondary].forEach((key,index)=>assert.equal(value.scores[key],STANDARD_ARRAY[index]));
 }
});
test('dual-primary classes reserve 15 and 14, followed by 13 for the secondary',()=>{
 for(const name of ['Monk','Paladin','Ranger']){
  const value=generateAbilities(name);assert.equal(value.primary.length,2);assert.equal(value.scores[value.secondary],13);
 }
});
test('saved scores stay unchanged; changing class creates a valid new allocation',()=>{
 const saved=generateAbilities('Wizard');assert.equal(abilitiesFor('Wizard',saved),saved);
 assert.equal(validAbilities(abilitiesFor('Barbarian',saved),'Barbarian'),true);
});
test('remaining abilities vary across generated characters',()=>{
 const first=generateAbilities('Barbarian',()=>0),second=generateAbilities('Barbarian',()=>.999);
 assert.notDeepEqual(first.scores,second.scores);
 assert.equal(first.scores.STR,15);assert.equal(second.scores.CON,14);
});
test('malformed saved values are rejected and modifiers follow 5e rounding',()=>{
 const bad=generateAbilities('Rogue');bad.scores.STR=30;assert.equal(validAbilities(bad,'Rogue'),false);
 assert.equal(validAbilities(null,'Wizard'),false);assert.equal(modifier(15),'+2');assert.equal(modifier(8),'-1');assert.equal(modifier(10),'+0');
 assert.equal(Object.keys(ABILITIES).length,6);
});
