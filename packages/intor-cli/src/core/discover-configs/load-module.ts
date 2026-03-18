export async function loadModule(filePath: string): Promise<unknown> {
  return import(filePath);
}
