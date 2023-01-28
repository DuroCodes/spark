import { pathToFileURL } from 'url';

/**
 * Imports a file with and adds a type to the import.
 * @param path The path of the file
 * @returns The imported file as `T`
 */
export async function importFile<T>(path: string): Promise<T> {
  return (await import(pathToFileURL(path).toString()))?.default;
}
