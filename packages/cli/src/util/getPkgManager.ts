import { execa } from 'execa';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';
export type PackageManagerTuple = [PackageManager, string];

/**
 * Checks if you have npm, yarn, or pnpm installed.
 */
export async function getPkgManager() {
  const npm = await execa('npm', ['-v']).catch(() => null);
  const npmVersion = npm?.stdout;

  const yarn = await execa('yarn', ['-v']).catch(() => null);
  const yarnVersion = yarn?.stdout;

  const pnpm = await execa('pnpm', ['-v']).catch(() => null);
  const pnpmVersion = pnpm?.stdout;

  const versions = {
    npmVersion,
    yarnVersion,
    pnpmVersion,
  };

  const entries = Object.entries(versions).filter(([k, v]) => {
    if (!v) return;
    return [k];
  });

  const results = entries.map(([k, v]) => [k.replace('Version', ''), v]) as PackageManagerTuple[];
  const mapped = results.map(([k]) => k);

  return mapped.length === 1 ? mapped[0] as PackageManager : mapped;
}
