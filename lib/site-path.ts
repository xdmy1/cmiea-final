const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function sitePath(path: string) {
  if (
    !basePath ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path === basePath ||
    path.startsWith(basePath + "/")
  )
    return path;
  return basePath + path;
}
