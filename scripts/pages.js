export const pages = {
 character: { file:'index.html', title:'Your adventure, on paper.', description:'Every step writes a little more of your story.', name:'Character' },
 achievements:{file:'achievements.html',title:'Your achievements.',description:'Every step, every streak, every level earned.',name:'Achievements'},
 quests: { file:'quests.html', title:'Your daily quests.', description:'Small steps. New chapters. A little more legendary.', name:'Daily quests' },
 connections: { file:'connections.html', title:'Connect your world.', description:'Your journey, your permissions, your choice.', name:'Connections' }
};
export function pageHTML(template, key) {
 const page=pages[key];
 return template
  .replace('<body>',`<body data-page="${key}">`)
  .replace(/<title>.*?<\/title>/,`<title>${page.name} · Level Up Life</title>`)
  .replace(/(<h1 id="page-title"[^>]*>).*?(<\/h1>)/,`$1${page.title}$2`)
  .replace(/(<p id="page-description">).*?(<\/p>)/,`$1${page.description}$2`)
  .replace(/<section class="page-view([^"]*)" id="page-(character|achievements|quests|connections)" aria-labelledby="page-title"(?: hidden)?>/g,(_,classes,view)=>`<section class="page-view${classes}" id="page-${view}" aria-labelledby="page-title"${view===key?'':' hidden'}>`)
  .replace(/<a href="(index|achievements|quests|connections)\.html"(?: aria-current="page")?>/g,(_,file)=>`<a href="${file}.html"${file+'.html'===page.file?' aria-current="page"':''}>`);
}
