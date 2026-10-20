import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'progress.js']) await copyFile(file, `dist/${file}`);
console.log('Static app built in dist/');

await cp('assets', 'dist/assets', { recursive: true });
