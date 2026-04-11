export type WriteToFileResult =
  | { ok: true }
  | {
    ok: false;
    status: 403 | 404 | 500;
    message: string;
  };

async function ensureParentDir(path: string): Promise<void> {
  const slash = path.lastIndexOf("/");
  if (slash <= 0) return;
  await Deno.mkdir(path.slice(0, slash), { recursive: true });
}

export async function writeToFile(
  path: string,
  content: string,
): Promise<WriteToFileResult> {
  try {
    await ensureParentDir(path);
    await Deno.writeTextFile(path, content);
    return { ok: true };
  } catch (e: unknown) {
    if (e instanceof Deno.errors.PermissionDenied) {
      return { ok: false, status: 403, message: "Permission denied" };
    }
    if (e instanceof Deno.errors.NotFound) {
      return { ok: false, status: 404, message: "Path not found" };
    }
    return { ok: false, status: 500, message: "Failed to write file" };
  }
}
