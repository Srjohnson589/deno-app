export type ReadFromFileResult =
  | { ok: true; content: string }
  | {
    ok: false;
    status: 403 | 404 | 500;
    message: string;
  };

export async function readFromFile(
  path: string,
): Promise<ReadFromFileResult> {
  try {
    const content = await Deno.readTextFile(path);
    return { ok: true, content };
  } catch (e: unknown) {
    if (e instanceof Deno.errors.NotFound) {
      return { ok: false, status: 404, message: "File not found" };
    }
    if (e instanceof Deno.errors.PermissionDenied) {
      return { ok: false, status: 403, message: "Permission denied" };
    }
    return { ok: false, status: 500, message: "Failed to read file" };
  }
}
