import { artworkFor, normalizeAppearance, ANCESTRY_NOTES } from './character-art.js';
import { dayKey, dayXP, progress, distance, streak } from './progress.js';
const $ = id => document.getElementById(id);
const KEY = 'level-up-life-v1';
let state = { character:null, days:{}, spot:null };
try { const saved=JSON.parse(localStorage.getItem(KEY)); if(saved && saved.days && typeof saved.days==='object') state={...state,...saved}; } catch { /* Start fresh when storage is unavailable or invalid. */ }
if(state.character) state.character={...state.character,...normalizeAppearance(state.character)};
let watcher=null, previous=null, walkMeters=0, walkBase=0, activeDay=dayKey(), toastTimer;
function notify(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',5500);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{notify('Storage is unavailable. Progress will only last for this session.');}render();}
function today(){return state.days[dayKey()] ||= { steps:0,checkin:false };}
const artRequests = new WeakMap();
function showArtwork(element, character) {
 const art=artworkFor(character);
 if(element.dataset.art===`${art.url}:${art.x}:${art.y}`) return;
 element.dataset.art=`${art.url}:${art.x}:${art.y}`;
 element.style.backgroundImage='none';
 element.setAttribute('aria-label',art.label);
 element.style.setProperty('--stature',art.stature);
 element.style.setProperty('--frame-aspect',art.aspectRatio);
 element.classList.add('art-loading');
 element.querySelector('.art-status').textContent='Preparing your portrait…';
 const request={};artRequests.set(element,request);
 const image=new Image();
 image.onload=()=>{if(artRequests.get(element)!==request)return;element.style.backgroundImage=`url("${art.url}")`;element.style.backgroundSize=`200% ${art.sizeY}%`;element.style.backgroundPosition=`${art.x}% ${art.positionY}%`;element.classList.remove('art-loading');};
 image.onerror=()=>{if(artRequests.get(element)!==request)return;element.querySelector('.art-status').textContent='Portrait unavailable. Please refresh to try again.';delete element.dataset.art;};
 image.src=art.url;
}
function previewAppearance(){
 const form=$('character-form');const appearance=normalizeAppearance(Object.fromEntries(new FormData(form)));
 showArtwork($('character-preview'),appearance);
 $('preview-title').textContent=`${appearance.age} ${appearance.gender.toLowerCase()} ${appearance.ancestry}`;
 $('preview-description').textContent=ANCESTRY_NOTES[appearance.ancestry];
}
function render(){
 showArtwork($('character-art'),state.character||{});
 const day=state.days[dayKey()]||{}, p=progress(state.days), s=streak(state.days);
 $('record-level').textContent=String(p.level).padStart(2,'0');
 $('record-xp').textContent=p.xp.toLocaleString()+' XP';
 $('record-streak').textContent=s+' '+(s===1?'day':'days');
 if(state.character){const c=state.character;$('sheet-name').textContent=c.name;$('sheet-class').textContent=c.class+' · Level '+p.level;$('sheet-ancestry').textContent=c.ancestry;$('sheet-gender').textContent=`${c.gender} · ${c.age}`;}
 $('date').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
 $('steps').replaceChildren(document.createTextNode((day.steps||0).toLocaleString()+' '),Object.assign(document.createElement('small'),{textContent:'steps'}));
 $('xp').replaceChildren(document.createTextNode(p.xp.toLocaleString()+' '),Object.assign(document.createElement('small'),{textContent:'XP total'}));
 $('streak').replaceChildren(document.createTextNode(s+' '),Object.assign(document.createElement('small'),{textContent:s===1?'day':'days'}));
 $('steps-meter').style.width=Math.min(100,(day.steps||0)/8000*100)+'%';
 $('goal-text').textContent=`${Math.min(100,Math.round((day.steps||0)/8000*100))}% of your 8,000 step goal`;
 $('xp-meter').style.width=p.current/5+'%';$('level-text').textContent=`Level ${p.level} · ${500-p.current} XP to next level`;
 $('quest-meter').style.width=Math.min(100,(day.steps||0)/2000*100)+'%';
 $('walk-reward').textContent=(day.steps||0)>=2000?'✓ Complete':'100 XP';
 $('streak-quest').textContent=s>=3?'✓ Complete':`${s} / 3 days`;
 $('checkin').disabled=!!day.checkin;$('checkin').textContent=day.checkin?'✓ Checked in':'Check in · +50 XP';
 $('week').replaceChildren();for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const el=document.createElement('span');el.title=d.toLocaleDateString();if(dayXP(state.days[dayKey(d)]))el.className='done';$('week').append(el);}
 if(state.character){const c=state.character;$('hero-tag').replaceChildren(document.createTextNode(c.name),Object.assign(document.createElement('small'),{textContent:`Level ${p.level} · ${c.ancestry} ${c.class}`}));$('create').textContent='Edit your character ↗';}
 $('location-label').textContent=watcher!==null?'Tracking this walk':state.spot?'Daily spot saved on this device':'Only when you choose';
 $('location').textContent=watcher!==null?'Stop walk':'Start walk';
}
function edit(){
 const form=$('character-form');const c=state.character||{name:'',class:'Ranger',...normalizeAppearance()};
 for(const key of ['name','class','ancestry','gender','age']) form.elements[key].value=c[key]||'';
 previewAppearance();$('character-dialog').showModal();
}
$('character-form').addEventListener('change',previewAppearance);
$('create').onclick=edit;$('edit-top').onclick=edit;$('cancel-character').onclick=()=>$('character-dialog').close();
$('character-form').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));data.name=data.name.trim();if(!data.name)return;state.character={...data,...normalizeAppearance(data)};save();$('character-dialog').close();notify('Your next chapter starts today. Welcome, '+data.name+'!');};
$('log').onclick=()=>{if(watcher!==null){notify('Stop your GPS walk before updating the daily total.');return;}$('movement-form').elements.steps.value=today().steps;$('movement-dialog').showModal();};
$('cancel-movement').onclick=()=>$('movement-dialog').close();
$('movement-form').onsubmit=e=>{e.preventDefault();const steps=Number(new FormData(e.target).get('steps'));if(!Number.isInteger(steps)||steps<0||steps>100000)return;today().steps=steps;save();$('movement-dialog').close();notify('Movement saved. Every step adds to your story.');};
function getPosition(){return new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(new Error('Location is unavailable in this browser.'));navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:20000,maximumAge:0});});}
function geoError(error){notify(error.code===1?'Location permission was declined. You can still log steps manually.':error.message||'Could not get your location. Try outdoors with GPS enabled.');}
$('checkin').onclick=async()=>{const button=$('checkin');button.disabled=true;try{if(!state.spot&&!confirm('Save your current location as your daily spot? It stays only in this browser. Future check-ins must be within 200 meters.'))return;const {coords}=await getPosition();if(coords.accuracy>100){notify('GPS accuracy is too low. Try again outdoors.');return;}if(!state.spot)state.spot={latitude:coords.latitude,longitude:coords.longitude};if(distance(state.spot,coords)>200){notify('You’re outside your daily spot. Return within 200 meters to check in.');return;}today().checkin=true;save();notify('You showed up! +50 XP. Your exact check-in location is not recorded.');}catch(error){geoError(error);}finally{render();}};
function stopWalk(){if(watcher!==null)navigator.geolocation.clearWatch(watcher);watcher=null;previous=null;render();}
$('location').onclick=()=>{
 if(watcher!==null){stopWalk();notify('Walk ended. Your estimated steps are saved.');return;}
 if(!navigator.geolocation){notify('This browser does not support location. Log your steps manually.');return;}
 if(!confirm('Track this walk while this page is open? GPS distance is converted to estimated steps (0.75 m per step) and added to today’s total. Don’t also add these steps manually. No route is stored or uploaded.'))return;
 walkMeters=0;walkBase=today().steps;activeDay=dayKey();previous=null;
 watcher=navigator.geolocation.watchPosition(({coords,timestamp})=>{
  if(dayKey()!==activeDay){walkMeters=0;walkBase=today().steps;activeDay=dayKey();previous=null;}
  if(coords.accuracy>50)return;
  if(previous){const meters=distance(previous.coords,coords),seconds=(timestamp-previous.timestamp)/1000;if(seconds>0&&seconds<120&&meters>=5&&meters/seconds<=3){walkMeters+=meters;today().steps=Math.min(100000,walkBase+Math.floor(walkMeters/.75));save();}}
  previous={coords,timestamp};
 },error=>{stopWalk();geoError(error);},{enableHighAccuracy:true,timeout:20000,maximumAge:0});render();notify('Walk started. Keep this page open; GPS steps are estimates.');
};
$('reset').onclick=()=>{if(!confirm('Delete your character, activity history, and saved daily spot from this browser? This cannot be undone.'))return;stopWalk();state={character:null,days:{},spot:null};save();location.reload();};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
window.addEventListener('pagehide',stopWalk);
render();
