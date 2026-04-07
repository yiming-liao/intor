import { Project, type SourceFile } from "ts-morph";

/**
 * Load source files from a tsconfig via ts-morph.
 */
export function getSourceFiles(tsconfigPath: string): SourceFile[] {
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  return project.getSourceFiles();
}
