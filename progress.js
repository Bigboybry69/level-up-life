export function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function dayXP(day = {}) { return Math.floor((day.steps || 0) / 100) * 5 + (day.checkin ? 50 : 0); }
export function progress(days) { const xp = Object.values(days).reduce((sum, day) => sum + dayXP(day), 0); return { xp, level: Math.floor(xp / 500) + 1, current: xp % 500 }; }
export function distance(a,b) { const rad = x => x*Math.PI/180; const dlat=rad(b.latitude-a.latitude), dlon=rad(b.longitude-a.longitude); const h=Math.sin(dlat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dlon/2)**2; return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)); }
export function streak(days, today = new Date()) { let count=0; const d=new Date(today); if(!dayXP(days[dayKey(d)])) d.setDate(d.getDate()-1); while(dayXP(days[dayKey(d)])){count++;d.setDate(d.getDate()-1);} return count; }
