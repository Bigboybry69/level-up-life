export const ABILITIES = {STR:'Strength', DEX:'Dexterity', CON:'Constitution', INT:'Intelligence', WIS:'Wisdom', CHA:'Charisma'};
export const STANDARD_ARRAY = [15,14,13,12,10,8];
export const CLASS_PRIORITIES = {
 Artificer:{primary:[['INT']],secondary:['CON','DEX']},
 Barbarian:{primary:[['STR']],secondary:['CON']},
 Bard:{primary:[['CHA']],secondary:['DEX','INT']},
 Cleric:{primary:[['WIS']],secondary:['CON','CHA']},
 Druid:{primary:[['WIS']],secondary:['CON','DEX']},
 Fighter:{primary:[['STR'],['DEX']],secondary:['CON']},
 Monk:{primary:[['DEX','WIS']],secondary:['CON','STR']},
 Paladin:{primary:[['STR','CHA']],secondary:['CON','WIS']},
 Ranger:{primary:[['DEX','WIS']],secondary:['CON']},
 Rogue:{primary:[['DEX']],secondary:['CON','INT','CHA']},
 Sorcerer:{primary:[['CHA']],secondary:['CON']},
 Warlock:{primary:[['CHA'],['INT']],secondary:['CON','WIS']},
 Wizard:{primary:[['INT']],secondary:['CON','DEX','WIS']}
};
function pick(items,random){return items[Math.floor(random()*items.length)];}
export function generateAbilities(className, random=Math.random){
 const rule=CLASS_PRIORITIES[className];if(!rule)throw new Error('Unknown character class');
 const primary=[...pick(rule.primary,random)],secondary=pick(rule.secondary,random);
 const order=[...primary,secondary];
 const rest=Object.keys(ABILITIES).filter(key=>!order.includes(key));
 for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}
 const scores=Object.fromEntries([...order,...rest].map((key,index)=>[key,STANDARD_ARRAY[index]]));
 return {className,primary,secondary,scores};
}
export function validAbilities(value,className){
 const rule=CLASS_PRIORITIES[className];
 if(!rule||!value||value.className!==className||!value.scores||!Array.isArray(value.primary))return false;
 if(!rule.primary.some(primary=>primary.join(',')===value.primary.join(','))||!rule.secondary.includes(value.secondary))return false;
 if(Object.keys(value.scores).sort().join(',')!==Object.keys(ABILITIES).sort().join(','))return false;
 if(!Object.values(value.scores).every(Number.isInteger))return false;
 if(Object.values(value.scores).sort((a,b)=>b-a).join(',')!==STANDARD_ARRAY.join(','))return false;
 return [...value.primary,value.secondary].every((key,index)=>value.scores[key]===STANDARD_ARRAY[index]);
}
export function abilitiesFor(className, existing){return validAbilities(existing,className)?existing:generateAbilities(className);}
export function modifier(score){const value=Math.floor((score-10)/2);return value>=0?'+'+value:String(value);}
