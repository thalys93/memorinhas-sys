export function resolveRoleName(role: unknown): string {
  if (!role) return '';
  if (typeof role === 'string') return role;
  if (typeof role === 'object' && role !== null && 'name' in role) {
    return String((role as { name: string }).name);
  }
  return '';
}

export function resolveRoleNames(roles: unknown): string[] {
  if (!roles) return [];
  if (Array.isArray(roles)) {
    return roles.map(resolveRoleName).filter(Boolean);
  }
  const single = resolveRoleName(roles);
  return single ? [single] : [];
}

export function hasAnyRole(userRoles: string[], allowed: readonly string[]): boolean {
  return userRoles.some((r) => allowed.includes(r));
}

export function toAuthUser(userData: {
  id: string;
  email: string;
  roles: unknown;
  name?: string;
}) {
  return {
    id: userData.id,
    email: userData.email,
    roles: resolveRoleNames(userData.roles),
    name: userData.name,
  };
}
