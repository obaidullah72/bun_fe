export function hasRole(user, roles) {
  if (!user) return false;
  return roles.includes(user.role);
}

export function canManageInventory(user) {
  return hasRole(user, ["Admin", "Manager"]);
}

export function canAccessPOS(user) {
  return hasRole(user, ["Admin", "Manager", "Cashier"]);
}

export function canViewReports(user) {
  return hasRole(user, ["Admin", "Manager"]);
}
