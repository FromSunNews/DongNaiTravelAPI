import { pick } from 'lodash'
 
export const pickUser = (user) => {
 if (!user) return {}
 return pick(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt'])
}
