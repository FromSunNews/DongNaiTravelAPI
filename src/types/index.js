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
 * @property {"readTime"} readTime
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
 * @property {string | undefined} authorId Id của một user, người mà tạo ra cái blog này
 * @property {string | undefined} reviewIds Id của review, mỗi reivews này sẽ chứa các review khác
 * @property {string | undefined} contentId Id của content
 * @property {string | undefined} name Tên của blog (title)
 * @property {string | undefined} avatar Ảnh đại diện của blog
 * @property {number | undefined} userFavoritesTotal Tổng số lượng người dùng thích blog này
 * @property {number | undefined} userCommentsTotal Tổng số lượng người dùng comment blog này (review)
 * @property {string | undefined} type Kiểu của blog
 * @property {number | undefined} readTime Thời gian đọc blog
 * @property {Array<string> | undefined} mentionedPlaces Những nơi được nhắc đến trong blog
 * @property {boolean | undefined} isApproved Blog này được duyệt hay chưa?
 * @property {number | undefined} updatedAt Thời gian lần cuối mà blog này cập nhật
 * @property {number | undefined} createdAt Thời gian blog này được tạo
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