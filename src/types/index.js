///
/// Types for Blog.
///
/**
 * @typedef BlogFieldNameProps
 * @property {"authorId"} authorId
 * @property {"commentIds"} commentIds
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
 * @property {"speechStatus"} speechStatus
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
/// Types for Blog Content.
///
/**
 * @typedef BlogContentDataProps
 * @property {string} plainText nội dung của blog nhưng không có MF
 * @property {string} plainTextMarkFormat nội dung của blog nhưng có MF
 * @property {string} speech đường link dẫn tới giọng đọc của blog
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

///
/// Types for Place.
///
/**
 * @typedef PlaceFieldNameProps
 * @property {"place_id"} place_id
 * @property {"photos_id"} photos_id
 * @property {"reviews_id"} reviews_id
 * @property {"content_id"} content_id
 * @property {"isRecommended"} isRecommended
 * @property {"user_favorites_total"} user_favorites_total
 * @property {"reference"} reference
 * @property {"plus_code"} plus_code
 * @property {"business_status"} business_status
 * @property {"current_opening_hours"} current_opening_hours
 * @property {"opening_hours"} opening_hours
 * @property {"formatted_address"} formatted_address
 * @property {"name"} name
 * @property {"address_components"} address_components
 * @property {"adr_address"} adr_address
 * @property {"formatted_phone_number"} formatted_phone_number
 * @property {"international_phone_number"} international_phone_number
 * @property {"geometry"} geometry
 * @property {"icon"} icon
 * @property {"icon_background_color"} icon_background_color
 * @property {"icon_mask_base_uri"} icon_mask_base_uri
 * @property {"rating"} rating
 * @property {"user_ratings_total"} user_ratings_total
 * @property {"editorial_summary"} editorial_summary
 * @property {"types"} types
 * @property {"url"} url
 * @property {"utc_offset"} utc_offset
 * @property {"vicinity"} vicinity
 * @property {"website"} website
 * @property {"wheelchair_accessible_entrance"} wheelchair_accessible_entrance
 * @property {"permanently_closed"} permanently_closed
 * @property {"curbside_pickup"} curbside_pickup
 * @property {"delivery"} delivery
 * @property {"dine_in"} dine_in
 * @property {"price_level"} price_level
 * @property {"reservable"} reservable
 * @property {"scope"} scope
 * @property {"secondary_opening_hours"} secondary_opening_hours
 * @property {"serves_beer"} serves_beer
 * @property {"serves_breakfast"} serves_breakfast
 * @property {"serves_brunch"} serves_brunch
 * @property {"serves_dinner"} serves_dinner
 * @property {"serves_lunch"} serves_lunch
 * @property {"serves_vegetarian_food"} serves_vegetarian_food
 * @property {"serves_wine"} serves_wine
 * @property {"takeout"} takeout
 * @property {"video_urls"} video_urls
 * @property {"createdAt"} createdAt
 * @property {"updatedAt"} updatedAt
 */

///
/// Types for ultilities
///
/**
 * @typedef LookupArraysProps
 * @property {Array<string>} isLiked
 */

/**
 * @typedef SpecialtyDataFieldProps
 * @property {string} field
 * @property {{[key: string]: any}} stages
 * @property {{[key: string]: (data: any) => any}} functionalStages
 */

export {}