/**
 * Returns `T` with keys 'name' and 'description' as strings.
 * Commands become processed after they are registered.
 */
export type Processed<T> = T & { name: string; description: string; };
