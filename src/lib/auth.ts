import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserWithRoles(userId: string) {
  const userList = await db.select().from(users).where(eq(users.id, userId));
  if (userList.length === 0) return null;
  
  const user = userList[0];

  const uRoles = await db.select({
    roleName: roles.name
  }).from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return { 
    ...user, 
    roles: uRoles.map(r => r.roleName) 
  };
}
