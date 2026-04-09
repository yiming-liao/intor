import { describe, expect, it } from "vitest";
import * as log from "../../../../src/shared/log";
import { createLogger } from "../../../../src/shared/log/logger";
import {
  renderConfigs,
  renderTitle,
  br,
} from "../../../../src/shared/log/render";
import { spinner } from "../../../../src/shared/log/spinner";

describe("shared/log exports", () => {
  it("re-exports logger, render helpers, and spinner", () => {
    expect(log.createLogger).toBe(createLogger);
    expect(log.renderConfigs).toBe(renderConfigs);
    expect(log.renderTitle).toBe(renderTitle);
    expect(log.br).toBe(br);
    expect(log.spinner).toBe(spinner);
  });
});
