///
/// Types for Blog.
///
/**
 * @typedef BlogFieldNameProps
 * @property {"authorId"} authorId
 * @property {"reviewIds"} reviewIds
 * @property {"contentId"} contentId
 * @property {"name"} name
 * @property {"avatar"} avatar
 * @property {"userFavoritesTotal"} userFavoritesTotal
 * @property {"userCommentsTotal"} userCommentsTotal
 * @property {"type"} type
 * @property {"mentionedPlaces"} mentionedPlaces
 * @property {"isApproved"} isApproved
 * @property {"createdAt"} createdAt
 * @property {"updatedAt"} updatedAt
 */

/**
 * @typedef BlogQualityNameProps
 * @property {"all"} all
 * @property {"most_favorites"} most_favorites
 * @property {"most_comments"} most_comments
 */

/**
 * @typedef BlogDataProps
 * @property {string | undefined} authorId
 * @property {string | undefined} reviewId
 * @property {string | undefined} contentId
 * @property {string | undefined} name
 * @property {string | undefined} avatar
 * @property {number | undefined} userFavoritesTotal
 * @property {number | undefined} userCommentsTotal
 * @property {string | undefined} type
 * @property {Array<string> | undefined} mentionedPlaces
 * @property {boolean | undefined} isApproved
 * @property {number | undefined} updatedAt
 * @property {number | undefined} createdAt
 */

///
/// Types for Content.
///
/**
 * @typedef ContentDataProps
 * @property {string | undefined} content_id
 * @property {{vi: string, en: string}} plainText
 * @property {{vi: string, en: string}} plainTextMarkFormat
 * @property {{vi: { VN_FEMALE_1: string, VN_MALE_1: string }, en: { EN_FEMALE_1: string, EN_MALE_1: string } }} speech
 * @property {number | undefined} updatedAt
 * @property {number | undefined} createdAt
 */

export {}