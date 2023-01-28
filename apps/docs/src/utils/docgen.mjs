import { createDocumentation } from 'typedoc-nextra';
import glob from 'fast-glob';
import fs from 'fs';

async function main() {
  const docFiles = (await glob('src/pages/docs/**/*.mdx')).filter((v) => !v.includes('index.mdx'));

  if (!docFiles.length) {
    await createDocumentation({
      input: [`${process.cwd()}/../../packages/handler/src/index.ts`],
      output: `${process.cwd()}/src/pages/docs/handler`,
      tsconfigPath: `${process.cwd()}/../../packages/handler/tsconfig-base.json`,
      markdown: true,
    });

    await createDocumentation({
      input: [`${process.cwd()}/../../packages/guards/src/index.ts`],
      output: `${process.cwd()}/src/pages/docs/guards`,
      tsconfigPath: `${process.cwd()}/../../packages/guards/tsconfig.json`,
      markdown: true,
    });

    return;
  }

  const paths = docFiles.map((v) => ({
    path: v,
    name: v.split('/').at(-1),
    folder: `${v.split('/').at(-4)}/${v.split('/').at(-2)}`,
  }));

  const folders = [...new Set(paths.map(({ folder }) => folder.split('/').at(-1)))];
  const subFolders = [...new Set(paths.map(({ folder }) => folder.split('/').at(0)))];

  paths.forEach(({ path, folder, name }) => {
    fs.renameSync(path, `src/pages/docs/${folder.split('/').reverse().join('/')}/${name}`);
  });

  folders.forEach((folder) => {
    const meta = folder !== 'guards'
      ? { classes: 'Classes', types: 'Types' }
      : { classes: 'Classes' };

    fs.writeFileSync(`src/pages/docs/${folder}/_meta.json`, JSON.stringify(meta, null, 2));

    subFolders.forEach((sub) => {
      try {
        fs.rmdirSync(`src/pages/docs/${folder}/${sub}/@spark.ts/${folder}`);
        fs.rmdirSync(`src/pages/docs/${folder}/${sub}/@spark.ts`);
      } catch (e) {
        //
      }
    });
  });

  const newFiles = await glob('src/pages/docs/**/*.mdx');

  newFiles.forEach((file) => {
    const data = fs.readFileSync(file, 'utf-8');

    const replacedData = data
      .split('\n')
      .map((v) => {
        if (v.includes('node_modules/discord.js/typings/index.d.ts')) {
          return '- [Source](https://github.com/discordjs/discord.js/blob/main/packages/discord.js/typings/index.d.ts)';
        }

        if (v.includes('node_modules/@types/node')) {
          return '';
        }

        return v;
      })
      .join('\n');

    const newData = `---
title: ${file.split('/').at(-1).split('.')[0]}
---

${replacedData}`;

    fs.writeFileSync(file, newData);
    fs.writeFileSync('src/pages/docs/_meta.json', JSON.stringify({
      index: 'Api Docs',
      handler: 'Handler',
      guards: 'Guards',
    }));
  });

  fs.writeFileSync('src/pages/docs/index.mdx', `---
title: API Docs
description: View the Spark API Docs
---

import Callout from '~/components/Callout';

## API Docs

In this section of the docs, you can view info on the classes and types, and view their methods and properties.

<Callout>
  This section is in beta, it may have some errors.
  For now, it's best to use the [guide](/guide) section to learn more.
</Callout>
`);
}

await main();
