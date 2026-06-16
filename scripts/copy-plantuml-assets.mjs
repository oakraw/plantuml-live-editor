import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'plantuml-core');

const BASE_URL = 'https://raw.githubusercontent.com/plantuml/plantuml-core/main/docs';
const files = ['plantuml-core.jar', 'plantuml-core.jar.js'];

mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const dest = join(outDir, file);
  if (existsSync(dest)) {
    console.log(`Skipping ${file} (already exists)`);
    continue;
  }
  console.log(`Downloading ${file} from plantuml/plantuml-core...`);
  const response = await fetch(`${BASE_URL}/${file}`);
  if (!response.ok) {
    throw new Error(`Failed to download ${file}: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  writeFileSync(dest, new Uint8Array(buffer));
  console.log(`  -> ${dest} (${buffer.byteLength} bytes)`);
}
console.log('PlantUML assets ready in public/plantuml-core/');
