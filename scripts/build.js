import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'progress.js', 'character-art.js']) {
 await copyFile(file, `dist/${file}`);
}
await cp('assets', 'dist/assets', { recursive: true });
console.log('Static app and character artwork built in dist/');
