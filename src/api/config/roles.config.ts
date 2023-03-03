/**
 * Roles are used to define the access rights of a user.
 * we use a custom middleware to check if the user has the right to access a route.
 * the middleware is located in the middleware folder (verifyApiRights.middleware.ts)
 */
export interface IApiRoles {
  superAdmin: string[];
  admin: string[];
  employee: string[];
  client: string[];
  vendor: string[];
  user: string[];
}

const roles: IApiRoles = {
  superAdmin: ['*', 'getUsers', 'createUsers', 'manageUsers', ' deleteUsers'],
  admin: ['getUsers', 'createUsers', 'manageUsers', ' deleteUsers'],
  employee: ['getUsers'],
  client: ['getUsers'],
  vendor: ['getUsers'],
  user: ['getUsers'],
};

export const apiRoles = Object.keys(roles);

export const apiRolesRights = new Map(Object.entries(roles));
