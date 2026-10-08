/** A local resource definition conflicts with another file. */
export class MessageConflictError extends Error {
  constructor(
    public readonly key: string,
    public readonly firstFile: string,
    public readonly secondFile: string,
  ) {
    super(
      `Conflicting message "${key}" in "${firstFile}" and "${secondFile}".`,
    );
    this.name = "MessageConflictError";
  }
}
