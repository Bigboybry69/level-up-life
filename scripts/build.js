import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pages, pageHTML } from './pages.js';
await mkdir('dist', { recursive: true });
const names=['style.css','app.js','progress.js','character-art.js','abilities.js','theme.js'];
const files=Object.fromEntries(await Promise.all(names.map(async file=>[file,await readFile(file,'utf8')])));
const version=createHash('sha256').update(names.map(name=>files[name]).join('\n')).digest('hex').slice(0,12);
let template=await readFile('index.html','utf8');
for(const name of names){
 let content=files[name];
 if(name==='app.js') for(const dependency of ['progress.js','character-art.js','abilities.js']) content=content.replaceAll(`'./${dependency}'`,`'./${dependency}?v=${version}'`);
 await writeFile(`dist/${name}`,content);
 template=template.replaceAll(`"${name}"`,`"${name}?v=${version}"`);
}
for(const key of Object.keys(pages)) await writeFile(`dist/${pages[key].file}`,pageHTML(template,key));
await cp('assets','dist/assets',{recursive:true});
console.log(`Built character, achievements, quests, and connections pages (${version}).`);
