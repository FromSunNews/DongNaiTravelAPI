import { pick } from 'lodash'
 
export const pickUser = (user) => {
 if (!user) return {}
 return pick(user, ['_id', 'email', 'username', 'displayName',
  'avatar', 'role', 'location', 'lovedPlaceIds', 'savedPlaceIds',
   'lovedBlogIds', 'savedBlogIds', 'receivePoints', 'lostPoints',
    'birthday', 'createdAt', 'updatedAt'])
}
