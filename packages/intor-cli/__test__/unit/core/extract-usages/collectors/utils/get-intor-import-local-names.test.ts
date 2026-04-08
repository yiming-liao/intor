import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { getIntorImportLocalNames } from "../../../../../../src/core/extract-usages/collectors/utils/get-intor-import-local-names";

function createSourceFile(code: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  return project.createSourceFile("test.ts", code);
}

describe("getIntorImportLocalNames", () => {
  it("gets imports from the root intor package", () => {
    const sourceFile = createSourceFile(`
      import { useTranslator } from "intor";
    `);

    expect(
      Array.from(getIntorImportLocalNames(sourceFile, "useTranslator")),
    ).toEqual(["useTranslator"]);
  });

  it("gets direct imports from Intor modules", () => {
    const sourceFile = createSourceFile(`
      import { Trans } from "intor/vue";
      import { useTranslator } from "intor/react";
    `);

    expect(Array.from(getIntorImportLocalNames(sourceFile, "Trans"))).toEqual([
      "Trans",
    ]);
    expect(
      Array.from(getIntorImportLocalNames(sourceFile, "useTranslator")),
    ).toEqual(["useTranslator"]);
  });

  it("gets aliased imports from Intor modules", () => {
    const sourceFile = createSourceFile(`
      import { Trans as IntorTrans } from "intor/vue";
      import { useTranslator as useT } from "intor/react";
    `);

    expect(Array.from(getIntorImportLocalNames(sourceFile, "Trans"))).toEqual([
      "IntorTrans",
    ]);
    expect(
      Array.from(getIntorImportLocalNames(sourceFile, "useTranslator")),
    ).toEqual(["useT"]);
  });

  it("ignores imports from non-Intor modules", () => {
    const sourceFile = createSourceFile(`
      import { Trans } from "./ui";
      import { useTranslator } from "@scope/intor";
    `);

    expect(Array.from(getIntorImportLocalNames(sourceFile, "Trans"))).toEqual(
      [],
    );
    expect(
      Array.from(getIntorImportLocalNames(sourceFile, "useTranslator")),
    ).toEqual([]);
  });

  it("ignores namespace and default imports", () => {
    const sourceFile = createSourceFile(`
      import Intor from "intor/vue";
      import * as IntorVue from "intor/vue";
    `);

    expect(Array.from(getIntorImportLocalNames(sourceFile, "Trans"))).toEqual(
      [],
    );
  });
});
