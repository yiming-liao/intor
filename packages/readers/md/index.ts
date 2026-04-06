import type { MessageObject, MessagesReader } from "intor";
import fs from "node:fs/promises";
import { INTOR_MESSAGES_KIND, INTOR_MESSAGES_KIND_KEY } from "intor/internal";
import { remark } from "remark";
import remarkGfm from "remark-gfm";

/**
 * Read a Markdown source and return a MessageObject.
 *
 * The parsed Markdown content is exposed under the `content` key.
 */
export const mdReader: MessagesReader = async (
  filePath,
  readFile = fs.readFile,
): Promise<MessageObject> => {
  // --------------------------------------------------
  // Read file
  // --------------------------------------------------
  const raw = await readFile(filePath, "utf8");

  // --------------------------------------------------
  // Parse content
  // --------------------------------------------------
  const markdown = await remark().use(remarkGfm).process(raw);

  return {
    content: markdown.toString(),
    [INTOR_MESSAGES_KIND_KEY]: INTOR_MESSAGES_KIND.markdown,
  };
};
