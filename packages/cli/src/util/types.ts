import { PackageManager } from './getPkgManager.js';

export type Language = 'javascript' | 'typescript';

export interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
}

export interface CliResults {
  appName: string;
  language: Language;
  pkgManager: PackageManager;
  flags: CliFlags;
}
