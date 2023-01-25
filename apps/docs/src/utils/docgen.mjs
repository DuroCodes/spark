import { createDocumentation } from 'typedoc-nextra';

await createDocumentation({
  input: [`${process.cwd()}/../../packages/handler/src/index.ts`],
  output: `${process.cwd()}/src/pages/docs/api`,
  tsconfigPath: `${process.cwd()}/../../packages/handler/tsconfig-base.json`,
  markdown: true,
});
