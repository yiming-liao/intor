import path from "node:path";
import { DEFAULT_OUT_DIR, DEFAULT_TYPES_FILE_NAME } from "../../constants";
import { ensureAndWrite } from "../ensure-and-write";

export async function writeTypes(generatedTypes: string): Promise<string> {
  const filePath = path.join(DEFAULT_OUT_DIR, DEFAULT_TYPES_FILE_NAME);
  return await ensureAndWrite(filePath, generatedTypes);
}
