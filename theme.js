(() => {
 const key='level-up-life-theme';
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 let preference=null;
 try{const saved=localStorage.getItem(key);if(saved==='dark'||saved==='light')preference=saved;}catch{}
 function apply(){
  const theme=preference||(system.matches?'dark':'light');
  document.documentElement.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#202724':'#e8dcc2');
  const button=document.getElementById('theme-toggle');
  if(button){const dark=theme==='dark';button.textContent=dark?'☀':'☾';button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');button.setAttribute('aria-pressed',String(dark));button.title=dark?'Switch to light mode':'Switch to dark mode';}
 }
 apply();
 if(system.addEventListener)system.addEventListener('change',()=>{if(!preference)apply();});
 document.addEventListener('DOMContentLoaded',()=>{
  apply();
  document.getElementById('theme-toggle')?.addEventListener('click',()=>{
   preference=document.documentElement.dataset.theme==='dark'?'light':'dark';
   try{localStorage.setItem(key,preference);}catch{}
   apply();
  });
 });
 window.addEventListener('storage',event=>{if(event.key===key){preference=['dark','light'].includes(event.newValue)?event.newValue:null;apply();}});
})();
