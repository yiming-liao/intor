import type { SourceFile } from "ts-morph";

const INTOR_MODULE_PREFIX = "intor";

// e.g. import {...} from "intor" ("intor/*")
function isIntorModuleSpecifier(moduleSpecifier: string): boolean {
  return (
    moduleSpecifier === INTOR_MODULE_PREFIX ||
    moduleSpecifier.startsWith(`${INTOR_MODULE_PREFIX}/`)
  );
}

/**
 * Get local names bound to an Intor import.
 */
export function getIntorImportLocalNames(
  sourceFile: SourceFile,
  importName: string,
): Set<string> {
  const localNames = new Set<string>();

  for (const declaration of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    if (!isIntorModuleSpecifier(moduleSpecifier)) continue;

    for (const namedImport of declaration.getNamedImports()) {
      if (namedImport.getName() !== importName) continue;

      localNames.add(namedImport.getAliasNode()?.getText() ?? importName);
    }
  }

  return localNames;
}
