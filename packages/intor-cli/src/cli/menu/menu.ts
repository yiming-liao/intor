import { outro, select, isCancel, intro } from "@clack/prompts";
import { check, discover, generate, validate } from "../../features";
import { bold, italic } from "../../shared";
import { FEATURES } from "../../shared";
import { VERSION } from "../version";
import { checkPrompt } from "./check";
import { discoverPrompt } from "./discover";
import { generatePrompt } from "./generate";
import { validatePrompt } from "./validate";

/**
 * Start the interactive Intor CLI menu.
 */
export async function start(): Promise<void> {
  intro(italic(bold("The Intor CLI.")));

  // -------------------------------------------------------------------
  // Select an action from the interactive menu
  // -------------------------------------------------------------------
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

  // -------------------------------------------------------------------
  // Run the selected feature
  // -------------------------------------------------------------------
  try {
    switch (action) {
      case "discover": {
        await discover(await discoverPrompt());
        break;
      }
      case "check": {
        await check(await checkPrompt());
        break;
      }
      case "generate": {
        await generate({ ...(await generatePrompt()), toolVersion: VERSION });
        break;
      }
      case "validate": {
        await validate(await validatePrompt());
        break;
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

export const menu = {
  start,
};
