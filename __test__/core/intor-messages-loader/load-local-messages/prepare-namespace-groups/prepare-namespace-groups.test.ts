import type pLimit from "p-limit";
import { mockIntorLogger } from "../../../../mock/mock-intor-logger";
import { prepareNamespaceGroups } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups";
import { traverseDirectory } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups/traverse-directory";

jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/prepare-namespace-groups/traverse-directory",
);

describe("prepareNamespaceGroups", () => {
  const { mockLogger } = mockIntorLogger();

  it("should call traverseDirectory and return the namespace groups map", async () => {
    const mockTraverseDirectory = traverseDirectory as jest.Mock;

    mockTraverseDirectory.mockImplementation(({ namespaceGroups }) => {
      namespaceGroups.set("home", {
        isAtRoot: true,
        filePaths: ["/path/to/home.json"],
      });
    });

    const result = await prepareNamespaceGroups({
      basePath: "/base",
      limit: ((fn: () => Promise<unknown>) => fn()) as unknown as ReturnType<
        typeof pLimit
      >,
      logger: mockLogger,
    });

    expect(mockTraverseDirectory).toHaveBeenCalledTimes(1);
    expect(result.get("home")).toEqual({
      isAtRoot: true,
      filePaths: ["/path/to/home.json"],
    });
  });

  it("should handle undefined logger gracefully", async () => {
    const mockTraverseDirectory = traverseDirectory as jest.Mock;

    mockTraverseDirectory.mockImplementation(({ namespaceGroups }) => {
      namespaceGroups.set("home", {
        isAtRoot: true,
        filePaths: ["/path/to/home.json"],
      });
    });

    const result = await prepareNamespaceGroups({
      basePath: "/base",
      limit: ((fn: () => Promise<unknown>) => fn()) as unknown as ReturnType<
        typeof pLimit
      >,
    });

    expect(result.get("home")).toEqual({
      isAtRoot: true,
      filePaths: ["/path/to/home.json"],
    });
  });
});
