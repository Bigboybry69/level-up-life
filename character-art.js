export const ANCESTRIES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
export const GENDERS = ['Male', 'Female'];
export const AGES = ['Teen', 'Adult', 'Elderly'];
export const ANCESTRY_NOTES = {
 Human: 'Rounded ears and familiar human proportions.',
 Elf: 'Long pointed ears and a tall, slender silhouette.',
 Dwarf: 'A broad, sturdy build and compact proportions.',
 Halfling: 'A small, rounded build, curly hair, and oversized bare feet.',
 Dragonborn: 'Draconic scales, a dragon snout, and clawed hands and feet.',
 Gnome: 'A tiny, wiry build with prominent pointed ears.',
 'Half-Elf': 'Humanlike proportions with subtly pointed ears.',
 'Half-Orc': 'Green-gray skin, lower tusks, and a powerful build.',
 Tiefling: 'Burgundy skin, curled horns, and a pointed tail.'
};
export function normalizeAppearance(character = {}) {
 return {
  ancestry: ANCESTRIES.includes(character.ancestry) ? character.ancestry : 'Human',
  gender: GENDERS.find(gender => gender.toLowerCase() === String(character.gender || '').trim().toLowerCase()) || 'Female',
  age: AGES.includes(character.age) ? character.age : 'Adult'
 };
}
// Frame boundaries follow the transparent gaps in the generated artwork.
const FRAME_ROWS = {
 "elf": [
  [
   0,
   510,
   1025,
   1536
  ],
  [
   0,
   510,
   1027,
   1536
  ]
 ],
 "gnome": [
  [
   0,
   512,
   1026,
   1536
  ],
  [
   0,
   512,
   1025,
   1536
  ]
 ],
 "dwarf": [
  [
   0,
   512,
   1024,
   1536
  ],
  [
   0,
   512,
   1024,
   1536
  ]
 ],
 "tiefling": [
  [
   0,
   522,
   1049,
   1536
  ],
  [
   0,
   520,
   1055,
   1536
  ]
 ],
 "half-orc": [
  [
   0,
   499,
   1022,
   1536
  ],
  [
   0,
   512,
   1028,
   1536
  ]
 ],
 "dragonborn": [
  [
   0,
   512,
   1030,
   1536
  ],
  [
   0,
   512,
   1044,
   1536
  ]
 ],
 "halfling": [
  [
   0,
   512,
   1024,
   1536
  ],
  [
   0,
   512,
   1024,
   1536
  ]
 ],
 "human": [
  [
   0,
   506,
   1024,
   1536
  ],
  [
   0,
   512,
   1024,
   1536
  ]
 ],
 "half-elf": [
  [
   0,
   513,
   1036,
   1536
  ],
  [
   0,
   512,
   1038,
   1536
  ]
 ]
};
export function artworkFor(character) {
 const appearance = normalizeAppearance(character);
 const column = appearance.gender === 'Male' ? 0 : 1;
 const row = AGES.indexOf(appearance.age);
 const bounds = FRAME_ROWS[appearance.ancestry.toLowerCase()][column];
 const top = bounds[row], height = bounds[row + 1] - top;
 return {
  ...appearance,
  positionY: top / (1536 - height) * 100,
  sizeY: 1536 / height * 100,
  aspectRatio: 512 / height,
  url: `assets/characters/${appearance.ancestry.toLowerCase()}.png`,
  x: appearance.gender === 'Male' ? 0 : 100,
  y: AGES.indexOf(appearance.age) * 50,
  stature: ({Halfling: .76, Gnome: .7, Dwarf: .86}[appearance.ancestry] || 1) * (appearance.age === 'Teen' ? .92 : 1),
  label: `${appearance.age} ${appearance.gender.toLowerCase()} ${appearance.ancestry} adventurer`
 };
}
