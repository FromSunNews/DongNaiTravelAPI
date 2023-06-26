import { pick } from 'lodash'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'displayName',
    'avatar', 'coverPhoto', 'role', 'location', 'savedSuggestions', 'lastName', 'firstName',
    'savedPlaces', 'followerIds', 'followingIds', 'notifIds', 'receivePoints', 'lostPoints',
    'birthday', 'createdAt', 'updatedAt'])
}