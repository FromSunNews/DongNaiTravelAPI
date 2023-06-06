import {
  SpecialUpdateCases
} from 'utilities/mongo'

/**
 * Các trường hợp update của user sẽ chia ra làm nhiều phần.
 * - Update mặc định: là kiểu update sẽ dùng toán tử $set và sẽ có cập nhật updatedAt.
 * - Update các trường array, vì đa phần các trường array này có toán tử update riêng, và không cần phải cập nhật updatedAt
 */
export const UserUpdateCases = {
  'default': (newUserData) => SpecialUpdateCases.default.getExprNExtUpdateFilter(newUserData),
  'addEle:savedPlaces': (placeId) => SpecialUpdateCases.addEle.getExprNExtUpdateFilter('savedPlaces', placeId),
  'removeEle:savedPlaces': (placeId) => SpecialUpdateCases.removeEle.getExprNExtUpdateFilter('savedPlaces', placeId),
  'addEle:follower': (userId) => SpecialUpdateCases.addEle.getExprNExtUpdateFilter('followerIds', userId),
  'removeEle:follower': (userId) => SpecialUpdateCases.removeEle.getExprNExtUpdateFilter('followerIds', userId),
  'addEle:savedBlogs': (blogId) => SpecialUpdateCases.addEle.getExprNExtUpdateFilter('savedBlogs', blogId),
  'removeEle:savedBlogs': (blogId) => SpecialUpdateCases.removeEle.getExprNExtUpdateFilter('savedBlogs', blogId)
}