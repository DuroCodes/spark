import { pathToFileURL } from 'url';

export async function importFile<T>(path: string): Promise<T> {
  return (await import(pathToFileURL(path).toString()))?.default;
}
