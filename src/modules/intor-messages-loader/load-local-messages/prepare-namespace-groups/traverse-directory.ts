import type {
  PrepareNamespaceGroupsOptions,
  NamespaceGroupValue,
} from "./prepare-namespace-groups";
import fs from "node:fs/promises";
import path from "node:path";
import { logry } from "logry";
import { addToNamespaceGroup } from "./add-to-namespace-group";

type TraverseDirectoryOptions = {
  options: PrepareNamespaceGroupsOptions;
  currentDirPath: string;
  namespaceGroups: Map<string, NamespaceGroupValue>;
  namespacePathSegments: string[];
};

export const traverseDirectory = async ({
  options,
  currentDirPath,
  namespaceGroups,
  namespacePathSegments,
}: TraverseDirectoryOptions): Promise<void> => {
  const { limit, loggerId } = options;
  const logger = logry({ id: loggerId, scope: "traverseDirectory" });

  try {
    const dirents = await fs.readdir(currentDirPath, { withFileTypes: true });

    const dirPromises = dirents.map((dirent) =>
      limit(async () => {
        const filePath = path.join(currentDirPath, dirent.name);

        // Dirent is a JSON file, add it to the namespace group
        if (dirent.isFile() && dirent.name.endsWith(".json")) {
          addToNamespaceGroup({
            namespaceGroups,
            filePath,
            namespacePathSegments,
            options,
          });
        }

        // Dirent is a directory, traverse it
        else if (dirent.isDirectory()) {
          await traverseDirectory({
            namespaceGroups,
            currentDirPath: filePath,
            namespacePathSegments: [...namespacePathSegments, dirent.name],
            options,
          });
        }
      }).catch((error) => {
        logger.warn("Failed to process a locale file or directory.", {
          name: dirent.name,
          type: dirent.isFile() ? "file" : "directory",
          path: currentDirPath,
          error,
        });
      }),
    );

    await Promise.all(dirPromises);
  } catch (error) {
    logger.warn(`Error reading directory: ${currentDirPath}`, { error });
  }
};
