import { outro, select, isCancel, intro } from "@clack/prompts";
import pc from "picocolors";
import { check, discover, generate, validate } from "../../features";
import { bold, italic } from "../../shared";
import { FEATURES } from "../../shared";
import { VERSION } from "../version";
import { promptCheck } from "./prompts/prompt-check";
import { promptDiscover } from "./prompts/prompt-discover";
import { promptGenerate } from "./prompts/prompt-generate";
import { promptValidate } from "./prompts/prompt-validate";

/**
 * Run a single CLI action with its corresponding prompt and handler.
 */
async function runAction<T>(
  prompt: () => Promise<T | null>,
  action: (options: T) => Promise<void>,
): Promise<boolean> {
  try {
    const options = await prompt();
    if (!options) {
      outro(pc.dim("Cancelled"));
      process.exit(0);
    }
    await action(options);
    return true;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return false;
  }
}

/**
 * Entry point for the interactive CLI menu.
 */
export async function run() {
  intro(italic(bold("The Intor CLI.")));

  const action = await select({
    message: "Select an action",
    options: [
      ...Object.values(FEATURES).map(({ name, title }) => ({
        value: name,
        label: title,
      })),
      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(action) || action === "exit") {
    outro("Exited");
    process.exit(0);
  }

  let completed = false;

  switch (action) {
    case "discover": {
      completed = await runAction(promptDiscover, discover);
      break;
    }
    case "check": {
      completed = await runAction(promptCheck, check);
      break;
    }
    case "generate": {
      completed = await runAction(promptGenerate, (options) =>
        generate({ ...options, toolVersion: VERSION }),
      );
      break;
    }
    case "validate": {
      completed = await runAction(promptValidate, validate);
      break;
    }
  }

  if (completed) {
    outro(pc.green("Completed"));
  }
}
