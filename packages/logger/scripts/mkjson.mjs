import { writeFile } from 'fs/promises';
import { join } from 'path';

const locations = process.argv;
locations.shift();
locations.shift();

for (const loc of locations) {
  if (loc.endsWith('cjs')) {
    await writeFile(join(loc, 'package.json'), JSON.stringify({ type: 'commonjs' }));
  } else {
    await writeFile(join(loc, 'package.json'), JSON.stringify({ type: 'module' }));
  }
}
