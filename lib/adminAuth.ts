export function isAuthorized(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const provided = request.headers.get("x-admin-password");
  return provided === password;
}
