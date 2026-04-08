import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { collectTransUsages } from "../../../../../src/core/extract-usages/collectors/collect-trans-usages";

function collectFromCode(code: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      jsx: 1, // React
      target: 99, // ESNext
    },
  });

  const sourceFile = project.createSourceFile("test.tsx", code);
  return collectTransUsages(sourceFile);
}

describe("collectTransUsages", () => {
  it("collects static i18nKey from <Trans /> (string literal)", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";  export function App() {
        return <Trans i18nKey="home.title" />;
      }
    `);
    expect(usages).toHaveLength(1);
    expect(usages[0]).toMatchObject({
      key: "home.title",
      file: expect.stringContaining("test.tsx"),
    });
  });

  it("collects static i18nKey from <Trans></Trans> (JSX expression)", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return (
          <Trans i18nKey={"profile.name"}>
            Hello
          </Trans>
        );
      }
    `);
    expect(usages).toHaveLength(1);
    expect(usages[0]?.key).toBe("profile.name");
  });

  it("ignores <Trans /> with dynamic i18nKey", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      const key = "home.title";  export function App() {
        return <Trans i18nKey={key} />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("ignores <Trans /> without i18nKey", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return <Trans />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("ignores <Trans /> with an i18nKey attribute but no initializer", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return <Trans i18nKey />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("ignores <Trans /> with an empty JSX expression i18nKey", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return <Trans i18nKey={} />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("ignores non-Trans components", () => {
    const usages = collectFromCode(`
      export function App() {
        return <Other i18nKey="home.title" />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("ignores Trans components imported from non-Intor modules", () => {
    const usages = collectFromCode(`
      import { Trans } from "./ui";
      export function App() {
        return <Trans i18nKey="home.title" />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("collects aliased Intor Trans imports", () => {
    const usages = collectFromCode(`
      import { Trans as IntorTrans } from "intor/vue";
      export function App() {
        return <IntorTrans i18nKey="home.title" />;
      }
    `);
    expect(usages).toHaveLength(1);
    expect(usages[0]?.key).toBe("home.title");
  });

  it("ignores member-expression JSX tags", () => {
    const usages = collectFromCode(`
      import * as Intor from "intor/vue";
      export function App() {
        return <Intor.Trans i18nKey="home.title" />;
      }
    `);
    expect(usages).toHaveLength(0);
  });

  it("collects multiple <Trans /> usages in the same file", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return (
          <>
            <Trans i18nKey="a.b" />
            <div>
              <Trans i18nKey={"c.d"} />
            </div>
          </>
        );
      }
    `);
    expect(usages).toHaveLength(2);
    expect(usages.map((u) => u.key)).toEqual(["a.b", "c.d"]);
  });

  it("records correct source location", () => {
    const usages = collectFromCode(`
      import { Trans } from "intor/vue";
      export function App() {
        return <Trans i18nKey="home.title" />;
      }
    `);
    const usage = usages[0];
    expect(usage?.line).toBeGreaterThan(0);
    expect(usage?.column).toBeGreaterThan(0);
  });
});
