import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages,pageHTML} from './pages.js';
test('every generated page starts with exactly its own content visible without JavaScript',async()=>{
 const template=await readFile(new URL('../index.html',import.meta.url),'utf8');
 for(const key of Object.keys(pages)){
  const html=pageHTML(template,key);
  const sections=[...html.matchAll(/<section class="page-view[^"]*" id="page-([^"]+)"[^>]*>/g)];
  assert.equal(sections.length,3);
  assert.deepEqual(sections.filter(m=>!m[0].includes(' hidden')).map(m=>m[1]),[key]);
  assert.ok(html.includes(`<title>${pages[key].name} · Level Up Life</title>`));
  assert.ok(html.includes(`<a href="${pages[key].file}" aria-current="page">`));
 }
});
