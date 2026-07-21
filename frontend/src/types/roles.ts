export enum Roles {
  Admin = 'Admin',
  Shopkeeper = 'Shopkeeper',
  Developer = 'Developer',
  User = 'User',
}

export const ADMIN_ROLES = [Roles.Admin, Roles.Developer];
export const SHOPKEEPER_ROLES = [Roles.Shopkeeper, Roles.Developer];
export const KEEPER_ELIGIBLE_ROLES = [Roles.Shopkeeper, Roles.Developer];
